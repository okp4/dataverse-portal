/* eslint-disable max-lines-per-function */
import type { StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createStore } from 'zustand/vanilla'
import { devtools } from 'zustand/middleware'
import type { Reader } from 'fp-ts/lib/Reader'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { identity, pipe } from 'fp-ts/lib/function'
import type { Option } from 'fp-ts/lib/Option'
import type { ForgetType } from '@/util/type'
import type { Wallet, Account } from './entity'
import type { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import type { WalletPortDeps, WalletPort } from './port'
import { eqWalletPort } from './port'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as TE from 'fp-ts/TaskEither'
import type { IOOption } from 'fp-ts/lib/IOOption'
import type * as P from './port'
import { sequenceS } from 'fp-ts/lib/Apply'

type Deps = WalletPortDeps & {
  walletPorts: WalletPort[]
}

type State = {
  data: Option<Wallet>
}

type Action = {
  // Connect a wallet to a chain.
  connectWalletForChain: (walletId: string, chainId: string) => ReaderTaskEither<Deps, Error, void>
  // Disconnect a wallet from a chain, if it is connected.
  disconnectWallet: () => ReaderTaskEither<Deps, Error, void>
}

type Query = {
  // Get the wallet connected to a chain, if any.
  wallet: () => IOOption<Wallet>
}

type Store = State & Action & Query
export type DomainAPI = ForgetType<State, Store>

export type Options = {
  initialState: State
}

export const toAccount = (v: P.Account): Account => ({
  id: `v.address`,
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

export const Domain =
  ({ initialState }: Partial<Options> = {}): Reader<void, StoreApi<DomainAPI>> =>
  () =>
    createStore(
      devtools(
        immer<Store>((set, get) => ({
          data: pipe(
            initialState,
            O.fromNullable,
            O.flatMap(it => it.data)
          ),
          wallet: () => () => get().data,
          connectWalletForChain: (walletId, chainId) =>
            pipe(
              RTE.asks((deps: Deps) => deps.walletPorts),
              RTE.chainOptionK(() => new Error(`Wallet with id "${walletId}" not found`))(
                findWalletPort(walletId)
              ),
              RTE.chainFirst(port =>
                pipe(port.connectChain(chainId), RTE.local<Deps, WalletPortDeps>(identity))
              ),
              RTE.chainTaskEitherK(port =>
                sequenceS(TE.ApplyPar)({
                  accounts: port.chainAccounts(chainId),
                  name: port.name(chainId)
                })
              ),
              RTE.map(ctx =>
                O.some({
                  id: walletId,
                  name: ctx.name,
                  chainId,
                  accounts: ctx.accounts.map(toAccount)
                })
              ),
              RTE.chainIOK(accounts => () => set({ data: accounts }))
            ),
          disconnectWallet: () =>
            pipe(
              RTE.fromIO(() => get().data),
              RTE.chain(RTE.fromOption(() => new Error(`No Wallet connected`))),
              RTE.chain(wallet =>
                pipe(
                  RTE.asks((deps: Deps) => deps.walletPorts),
                  RTE.chainOptionK(() => new Error(`Wallet with id "${wallet.id}" not found`))(
                    findWalletPort(wallet.id)
                  ),
                  RTE.chain(port =>
                    pipe(
                      port.disconnectChain(wallet.chainId),
                      RTE.local<Deps, WalletPortDeps>(identity)
                    )
                  )
                )
              ),
              RTE.chainIOK(() => () => set({ data: O.none }))
            )
        })),
        {
          anonymousActionType: 'Aggregate',
          enabled: process.env.NODE_ENV === 'development'
        }
      )
    )
