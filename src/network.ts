import inquirer from 'inquirer'
import { actionBack } from './index'
import { ProviderNames } from './providers'

let currentNetwork: ProviderNames

export async function chooseNetwork() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'network',
      message: `Choose a network`,
      choices: [
        ...Object.values(ProviderNames).filter((n) =>
          [ProviderNames.Polygon, ProviderNames.Avalanche].includes(n)
        ),
        actionBack,
      ],
    },
  ])
  if (answers.network === actionBack) {
    return Promise.reject(new Error(actionBack))
  }
  currentNetwork = answers.network
  return currentNetwork
}

export async function getCurrentNetwork() {
  if (!currentNetwork) {
    return await chooseNetwork()
  }
  return currentNetwork
}

export async function resetCurrentNetwork() {
  currentNetwork = undefined!
}
