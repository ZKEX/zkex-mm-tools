import { Wallet } from 'ethers'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import path from 'path'
import chalk from 'chalk'
import { actionBack } from '.'
import { checkAccountState } from './account'

export interface SecretData {
  accounts: Account[]
}
export interface Account {
  address: string
  privateKey: string
}

let currentAccount: Account

export async function createSecret(): Promise<SecretData> {
  try {
    const initialSecret = {
      accounts: [],
    }
    await fs.writeJson(path.resolve('.secret.json'), initialSecret)
    console.log(chalk.greenBright('Secret file saved', path.resolve('.secret.json')))
    return initialSecret
  } catch (e) {
    console.log(e)
    return await createSecret()
  }
}

export async function readSecret(): Promise<SecretData | undefined> {
  try {
    const secret: SecretData = await fs.readJson(path.resolve('.secret.json'))
    if ('accounts' in secret) {
      if (secret?.accounts?.length) {
        return secret
      }
    }
    return
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      console.log(chalk.bgRed('ERROR'), chalk.red('You must be import web3 wallet first.'))
    }
    return
  }
}

export async function addSecret(): Promise<Account> {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'privateKey',
        message: 'Enter your PrivateKey',
      },
    ])

    const wallet = new Wallet(answers.privateKey)
    const address = await wallet.getAddress()
    const secret = await readSecret()
    const account = {
      address,
      privateKey: answers.privateKey,
    }
    if (secret?.accounts) {
      if (secret?.accounts.findIndex((v) => v.address === address) >= 0) {
        throw new Error('Duplicate wallet.')
      }
    }
    const accounts = secret?.accounts ? [...secret.accounts, account] : [account]
    await fs.writeJson(path.resolve('.secret.json'), {
      accounts,
    })
    console.log(chalk.greenBright('PrivateKey saved to .secret.json'))

    currentAccount = account

    await checkAccountState()
    return account
  } catch (e: any) {
    if (e.code === 'INVALID_ARGUMENT') {
      console.log(chalk.bgRed('ERROR', chalk.red('Invalid PrivateKey.')))
    }
    console.log(e)
    return await addSecret()
  }
}

export async function getCurrentAccount(): Promise<Account> {
  const secret = await readSecret()
  if (!secret) {
    await createSecret()
    return await addSecret()
  }
  if (!currentAccount) {
    return secret.accounts[0]
  }
  return currentAccount
}

export async function changeWallet(): Promise<Account> {
  try {
    await getCurrentAccount()
    const secret = await readSecret()
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'overwrite',
        message: `Choose a wallet`,
        choices: [...secret!.accounts.map((a) => a.address), 'New Wallet', actionBack],
      },
    ])
    if (answers.overwrite === 'New Wallet') {
      return await addSecret()
    }
    currentAccount = secret!.accounts.find((v) => v.address === answers.overwrite) as Account
    return currentAccount
  } catch (e: any) {
    return await changeWallet()
  }
}
