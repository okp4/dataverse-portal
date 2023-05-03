/* eslint-disable max-lines-per-function */
import type { StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createStore } from 'zustand/vanilla'
import { devtools } from 'zustand/middleware'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { identity, pipe } from 'fp-ts/lib/function'
import type { ForgetType } from '@/util/type'
import type { Account, Wallet } from './entity'
import type { WalletPortDeps, WalletPort } from './port'
import { eqWalletPort } from './port'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as TE from 'fp-ts/TaskEither'
import type * as P from './port'
import * as R from 'fp-ts/Reader'
import { sequenceS } from 'fp-ts/lib/Apply'
import type { Command } from './command'
import type { Query, WalletType } from './query'
import type { Deps } from './dependency'
import type { Option } from 'fp-ts/lib/Option'
import type { Reader } from 'fp-ts/lib/Reader'

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

export const domain = ({ initialState }: Partial<Options> = {}): StoreApi<DomainAPI> =>
  createStore(
    devtools(
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
                accounts: ctx.accounts.map(fromPortAccount)
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
        enabled: import.meta.env.DEV
      }
    )
  )
