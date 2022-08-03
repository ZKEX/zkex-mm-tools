import chalk from 'chalk'
import { BigNumber, Contract, ethers, Wallet } from 'ethers'
import { formatEther, parseEther } from 'ethers/lib/utils'
import inquirer from 'inquirer'
import { LinkContract } from 'zklink-js-sdk'
import { PriorityOperationReceipt } from 'zklink-js-sdk/build/types'
import { fetchAccountState, Token } from './http/index'
import { actionBack } from './index'
import { getCurrentNetwork, resetCurrentNetwork } from './network'
import { getNetworkLinkId, getProvider } from './providers'
import { getCurrentAccount } from './secret'
import { chooseToken, getTokenAddressByLinkId, isGasAddress, isZeroAddress } from './tokens'
import { createLinkProvider, createLinkWallet, createWeb3Wallet, web3Wallet } from './wallet'

export function isMappingToken(tokenId: number) {
  return tokenId >= 17 && tokenId <= 31
}
export async function deposit(): Promise<any> {
  try {
    const currentAccount = await getCurrentAccount()
    const currentNetwork = await getCurrentNetwork()

    const linkId = getNetworkLinkId(currentNetwork)

    const web3Wallet = await createWeb3Wallet(currentNetwork)
    console.log('🚀 Load Gas balances ...')

    const gasBalances = await web3Wallet.getBalance()

    if (gasBalances.isZero()) {
      console.log(chalk.red(`Insufficient gas balances.`))
      resetCurrentNetwork()
      return await deposit()
    }
    console.log(chalk.greenBright('🌹 Gas balances'), formatEther(gasBalances))

    const token = await chooseToken(currentNetwork)
    const tokenAddress = getTokenAddressByLinkId(token, linkId)!
    console.log(chalk.greenBright('Selected'), token.symbol, tokenAddress)

    console.log('🚀 Load token balances ...')

    let balances: BigNumber = await balanceOf(tokenAddress, web3Wallet)

    if (balances.isZero()) {
      console.log(
        chalk.yellow(`Insufficient balances. Send mint transactions now. Please wait ...`)
      )
      balances = await mint(tokenAddress, web3Wallet)
    }
    console.log(chalk.greenBright(`🌹 ${token.symbol} balances`), balances.toString())
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'amount',
        message: 'Enter a amount to deposit:',
      },
    ])
    const linkWallet = await createLinkWallet(web3Wallet)
    const linkProvider = await createLinkProvider()
    const linkContract = LinkContract.fromEthSigner(linkProvider, web3Wallet)
    const approved =
      isZeroAddress(tokenAddress) || isGasAddress(tokenAddress)
        ? true
        : await linkContract.isERC20DepositsApproved(
            tokenAddress,
            await web3Wallet.getAddress(),
            linkId
          )
    console.log('🚀 Send transaction request ...')
    const tx = await linkWallet.depositToSyncFromEthereum({
      subAccountId: 1,
      depositTo: await web3Wallet.getAddress(),
      amount: parseEther(answers.amount),
      token: tokenAddress,
      linkChainId: linkId,
      mapping: isMappingToken(token.id),
      approveDepositAmountForERC20: !approved,
    })
    console.log('🚀 Transaction sended, wait receipt ...')

    const receipt: PriorityOperationReceipt = await tx.awaitReceipt(linkId)
    if (receipt?.executed) {
      if (receipt?.block?.committed) {
        console.log(chalk.greenBright('Deposit success.'))
        // listener.dispatch('deposit')
      } else {
        console.log(chalk.red('ERROR: Deposit fail.'))
      }
    }
    const state = await fetchAccountState(currentAccount.address)
  } catch (e: any) {
    if (e.message === actionBack) {
      return await deposit()
    }
  }
}

export async function mint(tokenAddress: string, web3Wallet: ethers.Signer): Promise<BigNumber> {
  const contract = new Contract(tokenAddress, ['function mint(address, uint256)'], web3Wallet)
  const tx = await contract.mint(await web3Wallet.getAddress(), parseEther('100000000'))
  console.log('Mint tx hash', tx.hash)
  const wait = await web3Wallet.provider!.waitForTransaction(tx.hash, 10)
  const balances = await balanceOf(tokenAddress, web3Wallet)
  return balances
}
export async function balanceOf(
  tokenAddress: string,
  web3Wallet: ethers.Signer
): Promise<BigNumber> {
  const currentAccount = await getCurrentAccount()
  const contract = new Contract(
    tokenAddress,
    ['function balanceOf(address) view returns (uint256)'],
    web3Wallet
  )

  const balances: BigNumber = await contract.balanceOf(currentAccount.address)
  return balances
}
