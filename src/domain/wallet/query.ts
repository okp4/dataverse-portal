import type { IOOption } from 'fp-ts/lib/IOOption'
import type { Reader } from 'fp-ts/Reader'
import type { Deps } from './dependency'

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

export type Query = {
  // Get the supported wallet types.
  supportedWalletTypes: () => Reader<Deps, WalletType[]>
  // Get the wallet connected to a chain, if any.
  wallet: () => IOOption<Wallet>
}
