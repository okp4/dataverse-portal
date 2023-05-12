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
  gasPriceStep?: {
    low: number
    average: number
    high: number
  }
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
}
