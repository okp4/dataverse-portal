const sharedChainConf = {
  stakeCurrency: {
    coinDenom: 'KNOW',
    coinMinimalDenom: 'uknow',
    coinDecimals: 6
  },
  bip44: {
    coinType: 118
  },
  bech32Config: {
    bech32PrefixAccAddr: 'okp4',
    bech32PrefixAccPub: 'okp4pub',
    bech32PrefixValAddr: 'okp4valoper',
    bech32PrefixValPub: 'okp4valoperpub',
    bech32PrefixConsAddr: 'okp4valcons',
    bech32PrefixConsPub: 'okp4valconspub'
  },
  currencies: [
    {
      coinDenom: 'KNOW',
      coinMinimalDenom: 'uknow',
      coinDecimals: 6
    }
  ],
  feeCurrencies: [
    {
      coinDenom: 'KNOW',
      coinMinimalDenom: 'uknow',
      coinDecimals: 6,
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.03
      },
      defaultFee: 5
    }
  ],
  coinType: 118
}

const APP_ENV = {
  urls: {
    'social:twitter': 'https://twitter.com/OKP4_Protocol',
    'social:linkedin': 'https://www.linkedin.com/company/okp4-open-knowledge-platform-for/',
    'social:discord': 'https://discord.com/invite/okp4',
    'social:medium': 'https://blog.okp4.network',
    'form:feedback': 'https://okp4.typeform.com/to/TNyFBH72',
    'form:error': 'https://okp4.typeform.com/to/GkWxots6',
    'about:okp4': 'https://okp4.network',
    'extension:keplr': 'https://www.keplr.app/download'
  },
  sparql: {
    endpoint: 'https://api.staging.okp4.space/ontology/world/sparql'
  },
  chains: [
    {
      id: 'okp4-nemeton-1',
      chainName: 'OKP4 nemeton',
      rpc: 'https://api.testnet.okp4.network:443/rpc',
      rest: 'https://api.testnet.okp4.network/',
      ...sharedChainConf
    },
    {
      id: 'okp4-devnet-1',
      chainName: 'OKP4 devnet',
      rpc: 'https://api.devnet.okp4.network:443/rpc',
      rest: 'https://api.devnet.okp4.network/',
      ...sharedChainConf
    },
    {
      id: 'okp4-devnet-staging-1',
      chainName: 'OKP4 devnet staging',
      rpc: 'https://api.devnet.staging.okp4.network:443/rpc',
      rest: 'https://api.devnet.staging.okp4.network:443/rpc',
      ...sharedChainConf
    }
  ],
  dropDown: { maxDisplayedSearchResults: 10, maxDisplayedTags: 4 },
  datePicker: {
    fromYearOffset: -100,
    toYearOffset: 20
  }
}
