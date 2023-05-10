import type { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import type { WalletPort, WalletPortDeps } from './port'

export type Deps = WalletPortDeps & {
  walletPorts: WalletPort[]
}

export const WalletNotFoundError = (walletId: string) =>
  ({ _tag: 'wallet-not-found', walletId } as const)

export type WalletNotFoundError = ReturnType<typeof WalletNotFoundError>

export const ChainNotFoundError = (chainId: string) =>
  ({
    _tag: 'chain-not-found',
    chainId
  } as const)

export type ChainNotFoundError = ReturnType<typeof ChainNotFoundError>

export const WalletNotAvailableError = (type: string) =>
  ({
    _tag: 'wallet-not-available',
    type
  } as const)

export type WalletNotAvailableError = ReturnType<typeof WalletNotAvailableError>

export const UserRejectedError = () => ({ _tag: 'user-rejected' } as const)

export type UserRejectedError = ReturnType<typeof UserRejectedError>

export const UnknownError = (message: string) =>
  ({
    _tag: 'unknown',
    message
  } as const)

export type UnknownError = ReturnType<typeof UnknownError>

export type Command = {
  // Connect a wallet to a chain.
  connectWalletForChain: (
    walletId: string,
    chainId: string
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
