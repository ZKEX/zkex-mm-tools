import { ethers } from 'ethers'
import { Provider, Wallet } from 'zklink-js-sdk'
import { L2_HOST } from '../conf/index'
import { getCurrentNetwork } from './network'
import { getProvider, ProviderNames } from './providers'
import { getCurrentAccount, SecretData } from './secret'

export let web3Wallet: ethers.Signer
export let linkProvider: Provider
export let linkWallet: Wallet
export async function createLinkProvider() {
  linkProvider = await Provider.newHttpProvider(L2_HOST)
  return linkProvider
}
export async function createLinkWallet(web3Signer: ethers.Signer) {
  linkProvider = await createLinkProvider()
  linkWallet = await Wallet.fromEthSigner(web3Signer, linkProvider)
  return linkWallet
}
export async function createWeb3Wallet(providerName?: ProviderNames): Promise<ethers.Signer> {
  const currentAccount = await getCurrentAccount()
  if (!providerName) {
    providerName = await getCurrentNetwork()
  }
  const web3Provider = getProvider(providerName)
  web3Wallet = new ethers.Wallet(currentAccount.privateKey, web3Provider)
  return web3Wallet
}
