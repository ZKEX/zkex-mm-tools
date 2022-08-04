import { getCurrentAccount, SecretData } from './secret'
import { fetchAccountState } from './http/index'
import chalk from 'chalk'
import { createLinkWallet, createWeb3Wallet } from './wallet'
import { getCurrentNetwork } from './network'
import { deposit } from './deposit'
import { getNetworkChainId, getNetworkLinkId, ProviderNames } from './providers'
import { AccountState } from 'zklink-js-sdk/build/types'
import { register } from './register'

export async function balances(): Promise<AccountState['committed']['balances']> {
  const state = await accountState()
  return {
    'ZKEX Balances': state.committed.balances[1],
  } as any
}

export async function accountState(): Promise<AccountState> {
  const currentAccount = await getCurrentAccount()
  const state = await fetchAccountState(currentAccount.address)
  return state.result
}

export async function checkAccountState() {
  const currentAccount = await getCurrentAccount()
  console.log('🚀 Load account state ...')
  const state = await fetchAccountState(currentAccount.address)
  const web3Wallet = await createWeb3Wallet(ProviderNames.Polygon)
  const linkWallet = await createLinkWallet(web3Wallet)
  if (state.result.id) {
    console.log(chalk.greenBright('Account is deposited.'))
  } else {
    console.log(chalk.red('Account id is null, deposit first.'))
    await deposit()
  }

  if (await linkWallet.isSigningKeySet()) {
    console.log(chalk.greenBright('Account is activated.'))
  } else {
    console.log(chalk.yellow('Account is locked, activate now, wait ...'))
    const currentNetwork = await getCurrentNetwork()
    const linkId = getNetworkLinkId(currentNetwork)
    const chainId = getNetworkChainId(currentNetwork)
    const { mainContract } = await linkWallet.provider.getContractAddress(linkId)
    const transaction = await linkWallet.setSigningKey({
      linkChainId: linkId,
      verifyingContract: mainContract,
      chainId,
      ethAuthType: 'ECDSA',
      feeToken: '',
      fee: 0,
    })

    await transaction.awaitReceipt()
    const isSigningKeySet: boolean = await linkWallet.isSigningKeySet()
  }
  await register()
}
