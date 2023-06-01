/* eslint-disable max-lines-per-function */
import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as O from 'fp-ts/Option'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
import type { StoreApi } from 'zustand/vanilla'
import { createStore } from 'zustand/vanilla'
import type { Dataverse } from './entity'
import type { DataversePort } from './port'
import type { IO } from 'fp-ts/lib/IO'
import type { ForgetType } from '@/util/type'
import type { ByTypeFilterInput, Command, DataverseElementType } from './command'
import type { ByTypeQueryFilter, DataverseQuery } from './valueObject'
import type { Query } from './query'

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
    case 'DataSpace':
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
            error: O.none,
            filters: { byType: 'all' },
            language: 'en'
          }))
        ),
        dataverse: () => () => get().data.dataverse,
        hasNext: () => () => get().data.hasNext,
        isLoading: () => () => get().data.isLoading,
        error: () => () => get().data.error,
        filters: () => () => get().data.filters,
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
        setLanguage: (newLng: string): IO<void> =>
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
        loadDataverse: (): T.Task<void> =>
          pipe(
            T.fromIO(() => get().data),
            T.chain(data =>
              pipe(
                data,
                O.fromPredicate(() => !data.isLoading),
                O.match(
                  () => T.of(undefined),
                  data =>
                    pipe(
                      T.fromIO(() =>
                        set(state => ({ data: { ...state.data, isLoading: true, error: O.none } }))
                      ),
                      T.chain(() =>
                        gateway.retrieveDataverse(
                          data.language,
                          data.limit,
                          data.dataverse.length,
                          data.filters
                        )
                      ),
                      TE.matchE(
                        e =>
                          T.fromIO(() =>
                            set(state => ({
                              data: {
                                ...state.data,
                                isLoading: false,
                                error: O.some(e)
                              }
                            }))
                          ),
                        r =>
                          T.fromIO(() =>
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
                )
              )
            )
          )
      })),
      {
        anonymousActionType: 'Aggregate',
        name: 'dataverse',
        enabled: import.meta.env.DEV
      }
    )
  )
