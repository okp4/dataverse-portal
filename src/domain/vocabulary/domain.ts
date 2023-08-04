/* eslint-disable max-lines-per-function */
import type { ForgetType } from '@/util/type'
import type { Command, Deps, VocabularyType } from './command'
import type { Vocabulary, VocabularyByType, VocabularyState } from './entity'
import type { StoreApi } from 'zustand/vanilla'
import { createStore } from 'zustand/vanilla'
import { flow, pipe } from 'fp-ts/lib/function'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as O from 'fp-ts/Option'
import type { Query, VocabularyDescriptorType } from './query'
import { isDevMode } from '@/util/env.util'
import * as I from 'fp-ts/Identity'
import * as IOO from 'fp-ts/IOOption'
import * as R from 'fp-ts/Record'
import * as A from 'fp-ts/Array'

export type State = {
  data: VocabularyState
}

type Domain = State & Command & Query
export type DomainAPI = ForgetType<State, Domain>

export type Options = {
  initialState: State
}

const defaultVocabulary: Vocabulary = {
  isLoading: false,
  hasNext: false,
  data: []
}

const defaultVocabularyByType: VocabularyByType = {
  area: defaultVocabulary,
  license: defaultVocabulary,
  'media-type': defaultVocabulary,
  topic: defaultVocabulary
}

export const storeFactory = ({ initialState }: Partial<Options> = {}): StoreApi<DomainAPI> =>
  createStore(
    devtools(
      immer<Domain>((set, get) => ({
        data: pipe(
          initialState,
          O.fromNullable,
          O.map(it => it.data),
          O.getOrElse<State['data']>(() => ({
            byType: defaultVocabularyByType
          }))
        ),
        vocabularyByType: (type: VocabularyDescriptorType) =>
          pipe(
            IOO.fromIO(() => get().data.byType),
            IOO.flatMap(flow(R.lookup(type), IOO.fromOption))
          ),
        retrieveVocabularyByType: (type: VocabularyType) =>
          pipe(
            RTE.asks(I.of<Deps>),
            RTE.flatMap(deps =>
              pipe(
                RTE.fromIO(() =>
                  set(state => ({
                    data: {
                      ...state.data,
                      byType: {
                        ...state.data.byType,
                        [type]: { ...state.data.byType[type], isLoading: true }
                      }
                    }
                  }))
                ),
                RTE.chain(() => RTE.fromIO(() => get().data.byType)),
                RTE.chainTaskEitherK(byType =>
                  deps.vocabularyGateway.retrieveVocabulary(
                    type,
                    deps.language,
                    deps.limit,
                    byType[type].data.length
                  )
                ),
                RTE.tapError(
                  flow(
                    RTE.left,
                    RTE.tapError(() =>
                      RTE.fromIO(() =>
                        set(state => ({
                          data: {
                            ...state.data,
                            byType: {
                              ...state.data.byType,
                              [type]: { ...state.data.byType[type], isLoading: false }
                            }
                          }
                        }))
                      )
                    )
                  )
                ),
                RTE.chainIOK(
                  r => () =>
                    set(state => ({
                      data: {
                        ...state.data,
                        byType: {
                          ...state.data.byType,
                          [type]: {
                            isLoading: false,
                            hasNext: r.query.hasNext,
                            data: pipe(state.data.byType[type].data, A.concat(r.data))
                          }
                        }
                      }
                    }))
                )
              )
            )
          )
      })),
      {
        anonymousActionType: 'Aggregate',
        name: 'vocabulary',
        enabled: isDevMode()
      }
    )
  )
