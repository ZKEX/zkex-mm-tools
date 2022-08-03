import { JsonRpcProvider } from '@ethersproject/providers'

export const PolygonProvider = new JsonRpcProvider('https://matic-mumbai.chainstacklabs.com', {
  name: 'Polygon Testnet',
  chainId: 80001,
})

export const AvalancheProvider = new JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc', {
  name: 'Avalanche Testnet',
  chainId: 43113,
})

export const RinkebyProvider = new JsonRpcProvider(
  'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  {
    name: 'Rinkeby',
    chainId: 4,
  }
)

export const GoerliProvider = new JsonRpcProvider(
  'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  {
    name: 'Goerli',
    chainId: 5,
  }
)

export enum ProviderNames {
  Polygon = 'Polygon',
  Avalanche = 'Avalanche',
  Rinkeby = 'Rinkeby',
  Goerly = 'Goerly',
}

export function getProvider(providerName: ProviderNames) {
  switch (providerName) {
    case ProviderNames.Polygon:
      return PolygonProvider
    case ProviderNames.Avalanche:
      return AvalancheProvider
    case ProviderNames.Rinkeby:
      return RinkebyProvider
    case ProviderNames.Goerly:
      return GoerliProvider
  }
}

export function getNetworkLinkId(providerName: ProviderNames) {
  switch (providerName) {
    case ProviderNames.Polygon:
      return 1
    case ProviderNames.Avalanche:
      return 2
    case ProviderNames.Rinkeby:
      return 3
    case ProviderNames.Goerly:
      return 4
  }
}
export function getNetworkChainId(providerName: ProviderNames) {
  switch (providerName) {
    case ProviderNames.Polygon:
      return 80001
    case ProviderNames.Avalanche:
      return 43113
    case ProviderNames.Rinkeby:
      return 4
    case ProviderNames.Goerly:
      return 5
  }
}
