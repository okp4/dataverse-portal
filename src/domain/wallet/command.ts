import type { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import type { WalletPort, WalletPortDeps } from './port'

export type ChainId = string

export type Deps = WalletPortDeps & {
  walletPorts: WalletPort[]
}

export const WalletNotFoundError = (walletId: string) =>
  ({ _tag: 'wallet-not-found', walletId } as const)

// Error for when the wallet with the given walletId is not found in the walletPorts list (provided as dependency).
export type WalletNotFoundError = ReturnType<typeof WalletNotFoundError>

export const ChainNotFoundError = (chainId: ChainId) =>
  ({
    _tag: 'chain-not-found',
    chainId
  } as const)

// Error for when the chain with the given chainId is not found in the chainInfos list (provided as dependency).
export type ChainNotFoundError = ReturnType<typeof ChainNotFoundError>

export const WalletNotAvailableError = (type: string) =>
  ({
    _tag: 'wallet-not-available',
    type
  } as const)

// Error for when wallet extension is unavailable (i.e. the extension is not installed in the browser).
export type WalletNotAvailableError = ReturnType<typeof WalletNotAvailableError>

export const UserRejectedError = () => ({ _tag: 'user-rejected' } as const)

// Error for when the user rejects the connection request to a chain.
export type UserRejectedError = ReturnType<typeof UserRejectedError>

export const UnknownError = (message: string) =>
  ({
    _tag: 'unknown',
    message
  } as const)

// Error for when an unknown error occurs.
export type UnknownError = ReturnType<typeof UnknownError>

export type ConnectWalletForChain = {
  walletId: string
  chainId: ChainId
}

export type Command = {
  // Connect a wallet to a chain.
  connectWalletForChain: (
    input: ConnectWalletForChain
  ) => ReaderTaskEither<
    Deps,
    | WalletNotFoundError
    | ChainNotFoundError
    | WalletNotAvailableError
    | UserRejectedError
    | UnknownError,
    void
  >
  // Disconnect a wallet from a chain, if it is connected.
  disconnectWallet: () => ReaderTaskEither<
    Deps,
    WalletNotAvailableError | WalletNotFoundError | UnknownError,
    void
  >
}
