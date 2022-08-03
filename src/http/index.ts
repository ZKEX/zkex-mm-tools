import fetch, { Response } from 'node-fetch'
import { AccountState } from 'zklink-js-sdk/build/types.js'
import { L2_HOST } from '../../conf/index.js'

export async function sendRequest<T>(method: string, params: T) {
  return fetch(`${L2_HOST}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id: 1,
    }),
  })
}

export interface RPCResponse<T> {
  jsonrpc: string
  result: T
  id: number
}

export async function fetchAccountState(address: string): Promise<RPCResponse<AccountState>> {
  const response = await sendRequest('account_info', [address])
  const state = await response.json()
  return state as RPCResponse<AccountState>
}

export interface Token {
  id: number
  symbol: string
  chains: number[]
  address: string[]
}

export async function fetchTokens(): Promise<Token[]> {
  const response = await sendRequest('tokens', [])
  const tokens = await response.json()
  return Object.values((tokens as any).result).filter(
    (v: any) => !['USD', 'AUTO', 'SYN'].includes(v.symbol)
  ) as Token[]
}
