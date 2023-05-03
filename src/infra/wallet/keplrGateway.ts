import type { WalletPort, ChainId, WalletPortDeps, Account, Accounts } from '@/domain/wallet/port'
import type { TaskEither } from 'fp-ts/lib/TaskEither'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { flow, pipe } from 'fp-ts/lib/function'
import type { ChainInfo } from '../../domain/wallet/port'
import * as A from 'fp-ts/Array'
import * as O from 'fp-ts/Option'
import type { AccountData, Keplr } from '@keplr-wallet/types'
import * as RA from 'fp-ts/ReadonlyArray'

const withKeplr = <T>(
  keplrFunction: (keplr: Keplr) => Promise<T>,
  onError: (e: unknown) => Error = E.toError
): TaskEither<Error, T> =>
  pipe(
    window.keplr,
    O.fromNullable,
    TE.fromOption(() => new Error('Keplr instance not found')),
    TE.flatMap(keplr => TE.tryCatch(async () => keplrFunction(keplr), onError))
  )

const enableChain = (chainId: ChainId): TaskEither<Error, void> =>
  withKeplr(async keplr => keplr.enable(chainId))

const disableChain = (chainId: ChainId): TaskEither<Error, void> =>
  withKeplr(async keplr => keplr.disable(chainId))

const suggestChain = (chainId: ChainId, chainInfos: ChainInfo[]): TaskEither<Error, void> =>
  pipe(
    chainInfos,
    A.findFirst<ChainInfo>(chainInfo => chainInfo.chainId === chainId),
    TE.fromOption(() => new Error(`ChainId ${chainId} not found in chainInfos`)),
    TE.flatMap(chainInfo => withKeplr(async keplr => keplr.experimentalSuggestChain(chainInfo)))
  )

export const mapAccount = (account: AccountData): E.Either<Error, Account> =>
  E.of({
    address: account.address,
    algorithm: account.algo,
    publicKey: account.pubkey
  })

export const keplrWalletGateway: WalletPort = {
  id: 'keplr',
  type: 'keplr',
  isAvailable: () => () =>
    pipe(
      O.fromNullable(window.keplr),
      O.map(keplr => keplr.getOfflineSigner),
      O.isSome
    ),
  connectChain: (chainId: ChainId) =>
    pipe(
      RTE.ask<WalletPortDeps>(),
      RTE.chainTaskEitherK((deps: WalletPortDeps) =>
        pipe(
          enableChain(chainId),
          TE.alt(() =>
            pipe(
              suggestChain(chainId, deps.chainInfos),
              TE.flatMap(() => enableChain(chainId))
            )
          )
        )
      )
    ),
  disconnectChain: (chainId: ChainId) => () => disableChain(chainId),
  name: chainId =>
    pipe(
      withKeplr(async keplr => keplr.getKey(chainId)),
      TE.map(key => key.name)
    ),
  chainAccounts: (chainId: ChainId): TaskEither<Error, Accounts> =>
    pipe(
      withKeplr(async keplr => keplr.getOfflineSigner(chainId).getAccounts()),
      TE.flatMap(TE.traverseArray(flow(mapAccount, TE.fromEither))),
      TE.map(RA.toArray)
    )
}
