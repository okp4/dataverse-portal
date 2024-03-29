/* eslint-disable max-lines-per-function */
import type { ForgetType } from '@/util/type'
import * as IO from 'fp-ts/IO'
import * as R from 'fp-ts/Reader'
import * as RT from 'fp-ts/ReaderTask'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as TE from 'fp-ts/TaskEither'
import { sequenceS } from 'fp-ts/lib/Apply'
import * as A from 'fp-ts/lib/Array'
import type { Option } from 'fp-ts/lib/Option'
import * as O from 'fp-ts/lib/Option'
import type { Reader } from 'fp-ts/lib/Reader'
import * as RA from 'fp-ts/lib/ReadonlyArray'
import { pipe } from 'fp-ts/lib/function'
import type { StoreApi } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createStore } from 'zustand/vanilla'
import type { Command, Deps } from './command'
import {
  ChainNotFoundError,
  UnknownError,
  UserRejectedError,
  WalletNotAvailableError,
  WalletNotFoundError
} from './command'
import type { Account, Wallet } from './entity'
import type * as P from './port'
import type { WalletPort } from './port'
import { eqWalletPort } from './port'
import type { Query, WalletType } from './query'

export type State = {
  data: Option<Wallet>
}

type Domain = State & Command & Query
export type DomainAPI = ForgetType<State, Domain>

export type Options = {
  initialState: State
}

const fromPortAccount = (v: P.Account): Account => ({
  id: v.address,
  address: v.address,
  algorithm: v.algorithm,
  publicKey: v.publicKey
})

const findWalletPort =
  (walletId: string) =>
  (walletPorts: WalletPort[]): O.Option<WalletPort> =>
    pipe(
      walletPorts,
      A.findFirst(port => eqWalletPort.equals(port, { id: walletId }))
    )

const mapError = <
  From extends
    | P.WalletNotAvailableError
    | P.UserRejectedError
    | P.ChainNotFoundError
    | P.UnknownError,
  To extends WalletNotAvailableError | UserRejectedError | ChainNotFoundError | UnknownError
>(
  from: From
): Extract<To, { _tag: From['_tag'] }> => {
  const extract = <U>(v: U): Extract<To, { _tag: From['_tag'] }> =>
    v as Extract<To, { _tag: From['_tag'] }>

  switch (from._tag) {
    case 'wallet-not-available':
      return extract(WalletNotAvailableError(from.type))
    case 'user-rejected':
      return extract(UserRejectedError())
    case 'chain-not-found':
      return extract(ChainNotFoundError(from.chainId))
    case 'unknown':
      return extract(UnknownError(from.message))
  }
}

export const storeFactory = ({ initialState }: Partial<Options> = {}): StoreApi<DomainAPI> =>
  createStore(
    devtools(
      persist(
        immer<Domain>((set, get) => ({
          data: pipe(
            initialState,
            O.fromNullable,
            O.flatMap(it => it.data)
          ),
          supportedWalletTypes: (): Reader<Deps, WalletType[]> =>
            pipe(
              R.asks((deps: Deps) => deps.walletPorts),
              R.map(
                A.map(port => ({
                  id: port.id,
                  type: port.type
                }))
              )
            ),
          wallet: () => () => get().data,
          connectWalletForChain: ({ walletId, chainId }) =>
            pipe(
              RTE.asks((deps: Deps) => deps.walletPorts),
              RTE.chainFirst(() => get().disconnectWallet()),
              RTE.chainOptionKW(() => WalletNotFoundError(walletId))(findWalletPort(walletId)),
              RTE.chainFirstW(port => pipe(port.connectChain(chainId), RTE.mapLeft(mapError))),
              RTE.chainTaskEitherKW(port =>
                pipe(
                  sequenceS(TE.ApplyPar)({
                    accounts: port.chainAccounts(chainId),
                    name: port.name(chainId)
                  }),
                  TE.mapLeft(mapError)
                )
              ),
              RTE.map(ctx =>
                O.some({
                  id: walletId,
                  name: ctx.name,
                  chainId,
                  accounts: ctx.accounts.map(fromPortAccount)
                })
              ),
              RTE.chainIOK(accounts => () => set({ data: accounts }))
            ),
          disconnectWallet: () =>
            pipe(
              RTE.fromIO(() => get().data),
              RTE.flatMap(data =>
                O.match(
                  () => RTE.right(undefined),
                  (wallet: Wallet) =>
                    pipe(
                      RTE.asks((deps: Deps) => deps.walletPorts),
                      RTE.chainOptionKW(() => WalletNotFoundError(wallet.id))(
                        findWalletPort(wallet.id)
                      ),
                      RTE.chainW(port =>
                        pipe(port.disconnectChain(wallet.chainId), RTE.mapLeft(mapError))
                      ),
                      RTE.chainIOK(() => () => set({ data: O.none }))
                    )
                )(data)
              )
            ),
          availableWalletTypes: () =>
            pipe(
              RT.asks((deps: Deps) => deps.walletPorts),
              RT.flatMap(
                pipe(
                  RT.traverseArray(port =>
                    pipe(
                      port.isAvailable(),
                      IO.map(available => ({
                        ...port,
                        available
                      })),
                      RT.fromIO
                    )
                  )
                )
              ),
              RT.map(RA.toArray)
            )
        })),
        {
          name: 'wallet-storage'
        }
      ),
      {
        anonymousActionType: 'Aggregate',
        name: 'wallet',
        enabled: import.meta.env.DEV
      }
    )
  )
