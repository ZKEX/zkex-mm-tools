import { Wallet } from 'ethers'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import path from 'path'
import chalk from 'chalk'

let currentAccount: SecretData

export interface SecretData {
  address: string
  privateKey: string
}
export async function readSecret(): Promise<SecretData> {
  try {
    const secret: SecretData = await fs.readJson(path.resolve('.secret.json'))
    if ('privateKey' in secret && 'address' in secret) {
      console.log(chalk.greenBright('Secret loaded.'), chalk.gray(secret.address))
    }
    currentAccount = secret
    return secret
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      console.log(chalk.bgRed('ERROR'), chalk.red('You must be import web3 wallet first.'))
    }

    return await generateSecret()
  }
}

export async function generateSecret(): Promise<SecretData> {
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
    await fs.writeJson(path.resolve('.secret.json'), {
      address,
      privateKey: answers.privateKey,
    })
    console.log(chalk.greenBright('Secret file saved', path.resolve('.secret.json')))
    return await readSecret()
  } catch (e: any) {
    if (e.code === 'INVALID_ARGUMENT') {
      console.log(chalk.bgRed('ERROR', chalk.red('Invalid PrivateKey.')))
    }
    return await generateSecret()
  }
}

export async function getCurrentAccount(): Promise<SecretData> {
  if (!currentAccount) {
    return await readSecret()
  }
  return currentAccount
}
