import type { Account, ChainId, ChainInfo, WalletPort, WalletPortDeps } from '@/domain/wallet/port'
import {
  ChainNotFoundError,
  UnknownError,
  WalletNotAvailableError,
  UserRejectedError
} from '@/domain/wallet/port'
import * as B from 'fp-ts/boolean'
import type { AccountData, Keplr } from '@keplr-wallet/types'
import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as RA from 'fp-ts/ReadonlyArray'
import * as TE from 'fp-ts/TaskEither'
import * as IO from 'fp-ts/lib/IO'
import type { IOOption } from 'fp-ts/lib/IOOption'
import * as IOO from 'fp-ts/lib/IOOption'
import type { TaskEither } from 'fp-ts/lib/TaskEither'
import { flow, pipe } from 'fp-ts/lib/function'

const type = 'keplr'
const keplr = (): IOOption<Keplr> => IOO.fromNullable(window.keplr)

type KeplrChainInfo = ChainInfo & { chainId: string }

const mapChainInfoToKeplrChainInfo = (chainInfo: ChainInfo): KeplrChainInfo => ({
  ...chainInfo,
  chainId: chainInfo.id
})

const asUnknownError = (e: unknown): UnknownError =>
  UnknownError(e instanceof Error ? e.message : String(e))

const withKeplr = <E, T>(
  keplrFunction: (keplr: Keplr) => Promise<T>,
  onError: (e: unknown) => E
): TaskEither<E | WalletNotAvailableError, T> =>
  pipe(
    keplr(),
    TE.fromIO,
    TE.flatMap(TE.fromOption(() => WalletNotAvailableError(type))),
    TE.flatMap(keplr => TE.tryCatch(async () => keplrFunction(keplr), onError))
  )

const enableChain = (
  chainId: ChainId
): TaskEither<WalletNotAvailableError | UserRejectedError | UnknownError, void> =>
  withKeplr(
    async keplr => keplr.enable(chainId),
    error => {
      const message = error instanceof Error ? error.message : String(error)
      if (message.includes('rejected')) {
        return UserRejectedError()
      }

      return UnknownError(message)
    }
  )

const disableChain = (chainId: ChainId): TaskEither<WalletNotAvailableError | UnknownError, void> =>
  withKeplr(async keplr => keplr.disable(chainId), asUnknownError)

const suggestChain = (
  chainId: ChainId,
  chainInfos: ChainInfo[]
): TaskEither<WalletNotAvailableError | ChainNotFoundError | UnknownError, void> =>
  pipe(
    chainInfos,
    A.findFirst<ChainInfo>(chainInfo => chainInfo.id === chainId),
    TE.fromOption(() => ChainNotFoundError(chainId)),
    TE.map(mapChainInfoToKeplrChainInfo),
    TE.flatMap(chainInfo =>
      withKeplr(async keplr => keplr.experimentalSuggestChain(chainInfo), asUnknownError)
    )
  )

export const mapAccount = (account: AccountData): E.Either<never, Account> =>
  E.of({
    address: account.address,
    algorithm: account.algo,
    publicKey: account.pubkey
  })

export const keplrWalletGateway: WalletPort = {
  id: 'keplr',
  type,
  isAvailable: () =>
    pipe(keplr(), IO.map(O.chainNullableK(keplr => keplr.getOfflineSigner)), IO.map(O.isSome)),
  connectChain: (chainId: ChainId) =>
    pipe(
      RTE.ask<WalletPortDeps>(),
      RTE.chainTaskEitherK((deps: WalletPortDeps) =>
        pipe(
          enableChain(chainId),
          TE.orElse(error =>
            B.match(
              () =>
                pipe(
                  suggestChain(chainId, deps.chainInfos),
                  TE.flatMap(() => enableChain(chainId))
                ),
              () => TE.left(error)
            )(error._tag === 'user-rejected' || error._tag === 'wallet-not-available')
          )
        )
      )
    ),
  disconnectChain: (chainId: ChainId) => () => disableChain(chainId),
  name: chainId =>
    pipe(
      withKeplr(async keplr => keplr.getKey(chainId), asUnknownError),
      TE.map(key => key.name)
    ),
  chainAccounts: (chainId: string) =>
    pipe(
      withKeplr(async keplr => keplr.getOfflineSigner(chainId).getAccounts(), asUnknownError),
      TE.flatMap(TE.traverseArray(flow(mapAccount, TE.fromEither))),
      TE.map(RA.toArray)
    )
}
