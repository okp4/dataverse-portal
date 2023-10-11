/* eslint-disable max-lines-per-function */
import { flow, pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as B from 'fp-ts/boolean'
import * as O from 'fp-ts/Option'
import * as TE from 'fp-ts/TaskEither'
import * as IO from 'fp-ts/IO'
import * as S from 'fp-ts/string'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
import type { StoreApi } from 'zustand/vanilla'
import { createStore } from 'zustand/vanilla'
import type { ForgetType } from '@/util/type'
import type { Dataverse } from './entity'
import type { DataversePort } from './port'
import type {
  ByPropertyFilterInput,
  ByServiceCategoryFilter,
  ByTypeFilterInput,
  Command,
  DataverseElementType,
  LoadDataverseError
} from './command'
import type { ByTypeQueryFilter, DataverseQuery } from './valueObject'
import type { Query } from './query'
import { isNetworkRequestAbortedError } from '@/shared/error/network'

export type State = {
  data: Dataverse & DataverseQuery
}

type Domain = State & Command & Query
export type DomainAPI = ForgetType<State, Domain>

export type Options = {
  initialState: State
}

const isDataverseElementByTypeFilter = (
  filter: ByTypeQueryFilter
): filter is DataverseElementType[] => filter !== 'all'

const removeByTypeFilter = (
  input: DataverseElementType,
  filter: DataverseElementType[]
): ByTypeQueryFilter =>
  pipe(
    filter,
    O.fromPredicate(l => l.length > 1),
    O.matchW(
      () => 'all',
      A.filter(r => r !== input)
    )
  )

const updateByTypeFilter = (
  input: ByTypeFilterInput,
  filter: ByTypeQueryFilter
): ByTypeQueryFilter => {
  switch (input) {
    case 'Zone':
    case 'Dataset':
    case 'Service':
      return pipe(
        filter,
        O.fromPredicate(isDataverseElementByTypeFilter),
        O.match(
          () => A.of(input),
          dataverseElementTypes =>
            pipe(
              dataverseElementTypes,
              O.fromPredicate(() => dataverseElementTypes.includes(input)),
              O.match(
                () => A.append(input)(dataverseElementTypes),
                f => removeByTypeFilter(input, f)
              )
            )
        )
      )
    case 'all':
      return 'all'
  }
}

export const storeFactory = (
  gateway: DataversePort,
  { initialState }: Partial<Options> = {}
): StoreApi<DomainAPI> =>
  createStore(
    devtools(
      immer<Domain>((set, get) => ({
        data: pipe(
          initialState,
          O.fromNullable,
          O.map(it => it.data),
          O.getOrElse<Dataverse & DataverseQuery>(() => ({
            dataverse: [],
            isLoading: false,
            limit: 20,
            hasNext: false,
            filters: { byType: 'all', byProperty: O.none, byServiceCategory: O.none },
            language: 'en'
          }))
        ),
        dataverse: () => () => get().data.dataverse,
        hasNext: () => () => get().data.hasNext,
        isLoading: () => () => get().data.isLoading,
        byTypeFilter: () => () => get().data.filters.byType,
        byPropertyFilter: () =>
          pipe(
            () => get().data.filters.byProperty,
            IO.map(
              flow(
                O.map(f => f.value),
                O.getOrElse(() => '')
              )
            )
          ),
        setByTypeFilter: (newFilter: ByTypeFilterInput) => () =>
          set(state => ({
            data: {
              ...state.data,
              dataverse: [],
              filters: {
                ...state.data.filters,
                byType: updateByTypeFilter(newFilter, state.data.filters.byType)
              }
            }
          })),
        setLanguage: (newLng: string): IO.IO<void> =>
          pipe(
            newLng,
            O.fromPredicate(lng => !!lng.length),
            O.match(
              () => () =>
                set(state => ({
                  data: {
                    ...state.data,
                    error: O.some(
                      new Error(
                        `Oops.. An error occurred in <setLanguage> call.. Parameter cannot be empty: <${newLng}>..`
                      )
                    )
                  }
                })),
              language => () =>
                set(state => ({
                  data: { ...state.data, dataverse: [], language }
                }))
            )
          ),
        loadDataverse: (): TE.TaskEither<LoadDataverseError, void> =>
          pipe(
            TE.fromIO(() => get().data),
            TE.chain(data =>
              pipe(
                TE.fromIO(() => set(state => ({ data: { ...state.data, isLoading: true } }))),
                TE.chainFirst(() => TE.fromIO(() => gateway.cancelDataverseRetrieval())),
                TE.chain(() =>
                  gateway.retrieveDataverse(
                    data.language,
                    data.limit,
                    data.dataverse.length,
                    data.filters
                  )
                ),
                TE.tapError(
                  flow(
                    TE.left,
                    TE.tapError(
                      flow(
                        O.fromPredicate(isNetworkRequestAbortedError),
                        O.match(
                          () =>
                            TE.fromIO(() =>
                              set(state => ({
                                data: { ...state.data, isLoading: false }
                              }))
                            ),
                          () => TE.of(undefined)
                        )
                      )
                    )
                  )
                ),
                TE.chainIOK(
                  r => () =>
                    set(state => ({
                      data: {
                        ...state.data,
                        isLoading: false,
                        hasNext: r.query.hasNext,
                        dataverse: pipe(data.dataverse, A.concat(r.data))
                      }
                    }))
                )
              )
            )
          ),
        setByPropertyFilter: (newFilter: ByPropertyFilterInput) => () =>
          set(state => ({
            data: {
              ...state.data,
              dataverse: [],
              filters: {
                ...state.data.filters,
                byProperty: pipe(
                  newFilter.value,
                  S.isEmpty,
                  B.match(
                    () => O.some(newFilter),
                    () => O.none
                  )
                )
              }
            }
          })),
        resetByTypeFilter: () => () =>
          set(state => ({
            data: {
              ...state.data,
              dataverse: [],
              filters: {
                ...state.data.filters,
                byType: 'all'
              }
            }
          })),
        resetByPropertyFilter: () => () =>
          set(state => ({
            data: {
              ...state.data,
              dataverse: [],
              filters: {
                ...state.data.filters,
                byProperty: O.none
              }
            }
          })),
        setByServiceCategoryFilter: (newFilter: ByServiceCategoryFilter) => () =>
          set(state => ({
            data: {
              ...state.data,
              dataverse: [],
              filters: {
                ...state.data.filters,
                byServiceCategory: newFilter
              }
            }
          })),
        resetByServiceCategoryFilter: () => () =>
          set(state => ({
            data: {
              ...state.data,
              dataverse: [],
              filters: {
                ...state.data.filters,
                byServiceCategory: O.none
              }
            }
          }))
      })),
      {
        anonymousActionType: 'Aggregate',
        name: 'dataverse',
        enabled: import.meta.env.DEV
      }
    )
  )
