export type Algorithm = 'secp256k1' | 'ed25519' | 'sr25519'

export type ChainId = string

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
