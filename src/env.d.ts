type ChainId = string

type Currency = {
  coinDenom: string
  coinMinimalDenom: string
  coinDecimals: number
  coinGeckoId?: string
  coinImageUrl?: string
  gasPriceStep?: {
    low: number
    average: number
    high: number
  }
}
type CW20Currency = Currency & {
  type: 'cw20'
  contractAddress: string
}
type Secret20Currency = Currency & {
  type: 'secret20'
  contractAddress: string
  viewingKey: string
}

type IBCCurrency = Currency & {
  paths: {
    portId: string
    channelId: string
  }[]
  originChainId: string | undefined
  originCurrency: Currency | CW20Currency | Secret20Currency | undefined
}

type AppCurrency = Currency | CW20Currency | Secret20Currency | IBCCurrency

type BIP44 = {
  coinType: number
}

type Bech32Config = {
  bech32PrefixAccAddr: string
  bech32PrefixAccPub: string
  bech32PrefixValAddr: string
  bech32PrefixValPub: string
  bech32PrefixConsAddr: string
  bech32PrefixConsPub: string
}

type ChainInfo = {
  id: ChainId
  rpc: string
  rest: string
  chainName: string
  stakeCurrency: Currency
  walletUrl?: string
  walletUrlForStaking?: string
  bip44: BIP44
  alternativeBIP44s?: BIP44[]
  bech32Config: Bech32Config
  currencies: AppCurrency[]
  feeCurrencies: Currency[]
  coinType?: number
  features?: string[]
  beta?: boolean
}

declare const APP_ENV: {
  urls: Record<
    | 'social:twitter'
    | 'social:linkedin'
    | 'social:discord'
    | 'social:medium'
    | 'form:feedback'
    | 'form:error'
    | 'about:okp4'
    | 'extension:keplr',
    string
  >
  sparql: Record<'endpoint', string>
  chains: ChainInfo[]
  dropDownMaxSearchResults: number
  dropDownTagsDisplayLimit: number
}
