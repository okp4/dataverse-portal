import type { Eq } from 'fp-ts/Eq'
import { contramap as eqContramap } from 'fp-ts/Eq'
import type { IO } from 'fp-ts/lib/IO'
import { contramap as ordContramap } from 'fp-ts/lib/Ord'
import type { Ord } from 'fp-ts/lib/Ord'
import type { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import { pipe } from 'fp-ts/lib/function'
import * as S from 'fp-ts/string'
import type { TaskEither } from 'fp-ts/lib/TaskEither'

export type ChainId = string

export type Currency = {
  coinDenom: string
  coinMinimalDenom: string
  coinDecimals: number
  coinGeckoId?: string
  coinImageUrl?: string
}
export type CW20Currency = Currency & {
  type: 'cw20'
  contractAddress: string
}
export type Secret20Currency = Currency & {
  type: 'secret20'
  contractAddress: string
  viewingKey: string
}

export type IBCCurrency = Currency & {
  paths: {
    portId: string
    channelId: string
  }[]
  originChainId: string | undefined
  originCurrency: Currency | CW20Currency | Secret20Currency | undefined
}

export type AppCurrency = Currency | CW20Currency | Secret20Currency | IBCCurrency

export type ChainInfo = {
  id: ChainId
  rpc: string
  rest: string
  chainId: string
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

export const eqChainInfo: Eq<{ id: string }> = pipe(
  S.Eq,
  eqContramap(it => it.id)
)

export type BIP44 = {
  coinType: number
}

export type Bech32Config = {
  bech32PrefixAccAddr: string
  bech32PrefixAccPub: string
  bech32PrefixValAddr: string
  bech32PrefixValPub: string
  bech32PrefixConsAddr: string
  bech32PrefixConsPub: string
}

export type Algorithm = 'secp256k1' | 'ed25519' | 'sr25519'
export type Account = {
  address: string
  algorithm: Algorithm
  publicKey: Uint8Array
}
export type Accounts = Account[]

export type WalletId = string
export const eqWalletId: Eq<WalletId> = S.Eq

export type WalletPortDeps = {
  chainInfos: ChainInfo[]
}

export const WalletNotAvailableError = () => ({ _tag: 'not-available' } as const)

export type WalletNotAvailableError = ReturnType<typeof WalletNotAvailableError>

export const UserRejectedError = () => ({ _tag: 'user-rejected' } as const)

export type UserRejectedError = ReturnType<typeof UserRejectedError>

export const ChainIdNotFoundError = (chainId: ChainId) =>
  ({
    _tag: 'chain-id-not-found',
    chainId
  } as const)

export type ChainIdNotFoundError = ReturnType<typeof ChainIdNotFoundError>

export const UnknownError = (message: string) =>
  ({
    _tag: 'unknown',
    message
  } as const)

export type UnknownError = ReturnType<typeof UnknownError>

// WalletPort is the interface that all wallet ports must implement.
// A wallet port is a wallet implementation for a specific wallet type (e.g. Keplr, Leap, etc.) and provides
// the necessary functions to interact with the wallet.
export type WalletPort = {
  // id returns the unique id of the wallet port implementation.
  id: string
  // type holds the type of the wallet port (e.g. Keplr, Leap, etc.).
  type: string
  // isAvailable returns true if the wallet port is available (e.g. the wallet extension is installed).
  isAvailable: () => IO<boolean>
  // connectChain connects the wallet port to the chain with the given chainId.
  connectChain: (
    chainId: ChainId
  ) => ReaderTaskEither<
    WalletPortDeps,
    WalletNotAvailableError | ChainIdNotFoundError | UserRejectedError | UnknownError,
    void
  >
  // disconnectChain disconnects the wallet port from the chain with the given chainId.
  disconnectChain: (
    chainId: ChainId
  ) => ReaderTaskEither<WalletPortDeps, WalletNotAvailableError | UnknownError, void>
  // name returns the name of the wallet.
  name: (chainId: ChainId) => TaskEither<WalletNotAvailableError | UnknownError, string>
  // chainAccounts returns the accounts of the chain with the given chainId.
  chainAccounts: (chainId: ChainId) => TaskEither<WalletNotAvailableError | UnknownError, Accounts>
}

export const eqWalletPort: Eq<{ id: string }> = pipe(
  eqWalletId,
  eqContramap(it => it.id)
)

export const byWalletPortType: Ord<WalletPort> = pipe(
  S.Ord,
  ordContramap(it => it.type)
)
