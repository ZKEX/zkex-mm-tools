import inquirer from 'inquirer'
import { fetchTokens, Token } from './http/index'
import { getCurrentNetwork } from './network'
import { getNetworkLinkId, ProviderNames } from './providers'

export function isZeroAddress(tokenAddress: string): boolean {
  if (!tokenAddress) {
    return false
  }
  return '0x0000000000000000000000000000000000000000' === tokenAddress
}

export function isGasAddress(tokenAddress: string): boolean {
  if (!tokenAddress) {
    return false
  }
  return '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toLowerCase() === tokenAddress.toLowerCase()
}

export async function chooseToken(providerName?: ProviderNames): Promise<Token> {
  if (!providerName) {
    providerName = await getCurrentNetwork()
  }
  const tokens = await fetchTokens()
  const currentLinkId = getNetworkLinkId(providerName)

  const usableTokens = tokens.filter((v) => v.chains.includes(currentLinkId))

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'token',
      message: `Choose a token`,
      choices: [...usableTokens.map((v) => v.symbol)],
    },
  ])
  return usableTokens.find((v) => v.symbol === answers.token) as Token
}

export function getTokenAddressByLinkId(token: Token, linkId: number) {
  const index = token.chains.findIndex((v) => v === linkId)
  if (index >= 0) {
    return token.address[index]
  }
}
