/* eslint-disable max-lines-per-function */
import { createStore } from 'zustand'
import type { StoreApi } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { flow, pipe } from 'fp-ts/function'
import type { ForgetType } from '@/util/type'
import type { AuditMetadataItem, GeneralMetadataItem, Metadata, MetadataItem } from './entity'
import type { Query } from './query'
import type { Command, Deps } from './command'
import { isDevMode } from '@/util/env.util'

type State = {
  data: Metadata
}

type Domain = State & Command & Query
export type DomainAPI = ForgetType<State, Domain>

export type Options = {
  initialState: State
}
const isAuditMetadataItem = (metadataItem: MetadataItem): metadataItem is AuditMetadataItem =>
  metadataItem.category === 'auditMetadata'

const isGeneralMetadataItem = (metadataItem: MetadataItem): metadataItem is GeneralMetadataItem =>
  metadataItem.category === 'generalMetadata'

export const storeFactory = ({ initialState }: Partial<Options> = {}): StoreApi<DomainAPI> =>
  createStore(
    devtools(
      immer<Domain>((set, get) => ({
        data: pipe(
          initialState,
          O.fromNullable,
          O.map(it => it.data),
          O.getOrElse<Metadata>(() => ({
            data: [],
            isLoading: false
          }))
        ),
        isLoading: () => () => get().data.isLoading,
        auditMetadata: () => () =>
          pipe(
            get().data.data,
            A.filter(isAuditMetadataItem),
            A.map(auditMetadata => ({
              property: auditMetadata.property,
              value: auditMetadata.value
            }))
          ),
        generalMetadata: () => () =>
          pipe(
            get().data.data,
            A.filter(isGeneralMetadataItem),
            A.map(generalMetadata => ({
              property: generalMetadata.property,
              value: generalMetadata.value
            }))
          ),
        retrieveDataverseItemMetadata: dataverseItemId =>
          pipe(
            RTE.ask<Deps>(),
            RTE.flatMap(deps =>
              pipe(
                RTE.fromIO(() =>
                  set(state => ({
                    data: {
                      ...state.data,
                      isLoading: true
                    }
                  }))
                ),
                RTE.chainTaskEitherK(() =>
                  deps.metadataPort.retrieveMetadata(dataverseItemId, deps.language)
                ),
                RTE.tapError(
                  flow(
                    RTE.left,
                    RTE.tapError(() =>
                      RTE.fromIO(() =>
                        set(state => ({
                          data: { ...state.data, isLoading: false }
                        }))
                      )
                    )
                  )
                ),
                RTE.chainIOK(
                  metadata => () => set(() => ({ data: { data: metadata, isLoading: false } }))
                )
              )
            )
          )
      })),
      {
        anonymousActionType: 'Aggregate',
        name: 'metadata',
        enabled: isDevMode()
      }
    )
  )
