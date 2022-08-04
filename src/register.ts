import { utils } from 'ethers'
import { createLinkWallet, createWeb3Wallet } from './wallet'
import fetch from 'node-fetch'
import { ZKEX_API_URL } from '../conf'
import { ProviderNames } from './providers'
import chalk from 'chalk'

export async function register(): Promise<any> {
  try {
    const web3Wallet = await createWeb3Wallet(ProviderNames.Avalanche)
    const linkWallet = await createLinkWallet(web3Wallet)
    const pubkey = await linkWallet.signer?.pubKey()
    const address = await web3Wallet.getAddress()
    const message =
      'Sign this message to confirm you are the owner of this wallet.\nNOTE: Please check this website ends with "app.zkex.com".'
    const messageBytes = utils.toUtf8Bytes(message)
    const signature = await web3Wallet.signMessage(message)
    if (pubkey) {
      const res = await fetch(`${ZKEX_API_URL}/users`, {
        method: 'POST',
        body: JSON.stringify({
          pubkey: pubkey.replace(/^0x/, ''),
          address,
          message,
          signature,
        }),
      })
      console.log(
        chalk.greenBright('ZKEX trading enabled.'),
        'ZKEX Token:',
        chalk.gray(res.headers.get('Access-Token'))
      )
    }
  } catch (e: any) {
    console.log(e)
  }
}
