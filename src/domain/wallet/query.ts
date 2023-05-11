import type { IOOption } from 'fp-ts/lib/IOOption'
import type { Reader } from 'fp-ts/Reader'
import type { WalletPort, WalletPortDeps } from './port'
import type { ReaderTask } from 'fp-ts/lib/ReaderTask'

export type ChainId = string
export type Algorithm = 'secp256k1' | 'ed25519' | 'sr25519'

export type Wallet = {
  id: string
  name: string
  chainId: ChainId
  accounts: Account[]
}

export type Account = {
  id: string
  address: string
  algorithm: Algorithm
  publicKey: Uint8Array
}

export type WalletType = {
  id: string
  type: string
}

export type WalletTypeAvailabilty = WalletType & {
  available: boolean
}

export type Deps = WalletPortDeps & {
  walletPorts: WalletPort[]
}

export type Query = {
  // Get the supported wallet types (e.g. 'keplr', 'ledger', etc.), without considering whether the wallet is available or not.
  supportedWalletTypes: () => Reader<Deps, WalletType[]>
  // Get the wallets available. This is a convenient query to know the wallets that are installed in the browser.
  availableWalletTypes: () => ReaderTask<Deps, WalletTypeAvailabilty[]>
  // Get the wallet connected to a chain, if any.
  wallet: () => IOOption<Wallet>
}
