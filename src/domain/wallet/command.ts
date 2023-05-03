import type { ReaderTaskEither } from "fp-ts/lib/ReaderTaskEither"
import type { Deps } from "./dependency"

export type Command = {
    // Connect a wallet to a chain.
    connectWalletForChain: (walletId: string, chainId: string) => ReaderTaskEither<Deps, Error, void>
    // Disconnect a wallet from a chain, if it is connected.
    disconnectWallet: () => ReaderTaskEither<Deps, Error, void>
  }