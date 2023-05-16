/* eslint-disable max-lines-per-function */
import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as O from 'fp-ts/Option'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'
import type { DataverseDTO } from './dto'
import type { DataverseEntity } from './entity'
import type { DataversePort } from './port'
import type { IO } from 'fp-ts/lib/IO'

export type DataverseElementType = 'DataSpace' | 'Dataset' | 'Service'
export type ByTypeQueryFilter = DataverseElementType[] | 'all'
export type SetByTypeFilterInput = DataverseElementType | 'all'

type DataverseQueryFilters = {
  byType: ByTypeQueryFilter
}

type DataverseQueryError = Error

type DataverseQuery = {
  limit: number
  hasNext: boolean
  isLoading: boolean
  error: O.Option<DataverseQueryError>
  filters: DataverseQueryFilters
  language: string
  setIsLoading: (isLoading: boolean) => IO<void>
  setHasNext: (hasNext: boolean) => IO<void>
  setError: (error: O.Option<DataverseQueryError>) => IO<void>
  setByTypeFilter: (newFilter: SetByTypeFilterInput) => IO<void>
  setLanguage: (newLng: string) => IO<void>
}

type DataverseAggregate = {
  dataverse: DataverseEntity
  query: DataverseQuery
  addToDataverse: (newDataverse: DataverseEntity) => IO<void>
  clearDataverse: () => IO<void>
  loadDataverse: () => T.Task<void>
}

const isAllFilter = (filter: ByTypeQueryFilter | SetByTypeFilterInput): filter is 'all' =>
  filter === 'all'

// Public contract with the controller that consumes the store
export type DataverseStore = {
  query: {
    hasNext: boolean
    isLoading: boolean
    error: O.Option<DataverseQueryError>
    filters: DataverseQueryFilters
    setByTypeFilter: (newFilter: SetByTypeFilterInput) => IO<void>
    setLanguage: (newLng: string) => IO<void>
  }
  dataverse: DataverseDTO
  loadDataverse: () => T.Task<void>
}

type ImmerSetReturnType = Partial<DataverseAggregate>

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const dataverseAggregate = (gateway: DataversePort) => () =>
  createStore<DataverseAggregate, [['zustand/devtools', never], ['zustand/immer', never]]>(
    devtools(
      immer<DataverseAggregate>((set, get) => ({
        dataverse: [],
        query: {
          limit: 20,
          hasNext: false,
          isLoading: false,
          error: O.none,
          filters: { byType: 'all' },
          language: 'en',
          setIsLoading:
            (isLoading: boolean): IO<void> =>
            () =>
              set(
                (state): ImmerSetReturnType => ({
                  query: { ...state.query, isLoading }
                })
              ),
          setHasNext:
            (hasNext: boolean): IO<void> =>
            () =>
              set(
                (state): ImmerSetReturnType => ({
                  query: { ...state.query, hasNext }
                })
              ),
          setError:
            (error: O.Option<DataverseQueryError>): IO<void> =>
            () =>
              set(
                (state): ImmerSetReturnType => ({
                  query: { ...state.query, error }
                })
              ),
          setByTypeFilter:
            (newFilter: SetByTypeFilterInput): IO<void> =>
            () => {
              const {
                clearDataverse,
                query: {
                  filters: { byType }
                }
              } = get()
              clearDataverse()()

              // const filterExists = A.findFirst(elt => elt === newFilter)(byType)
              const hasOneFilter = (): boolean => byType.length === 1
              const isAllFilterPredicate = O.fromPredicate(isAllFilter)
              const hasOneFilterPredicate = O.fromPredicate(hasOneFilter)
              const resetFilter = (): ByTypeQueryFilter => 'all'
              // const i = () => isByTypeAllFilter(byType) ? [...newFilter] : [...byType, ...newFilter]
              // const updateWithFilter = (): ByTypeQueryFilter =>
              //  pipe(byType, A.filter(isNotAllFilter), A.append(newFilter))
              // const updateWithoutFilter = (): ByTypeQueryFilter[] =>
              //   A.filter(elt => elt !== newFilter)(byType)

              const addFilter = (): void =>
                set(
                  (state): ImmerSetReturnType => ({
                    query: {
                      ...state.query,
                      filters: {
                        ...state.query.filters,
                        byType: pipe(
                          newFilter,
                          isAllFilterPredicate,
                          O.match(
                            () =>
                              pipe(
                                byType,
                                isAllFilterPredicate,
                                O.matchW(
                                  () =>
                                    pipe(
                                      byType as DataverseElementType[],
                                      A.append(newFilter)
                                    ) as DataverseElementType[],
                                  () => A.of(newFilter) as DataverseElementType[]
                                )
                              ),
                            resetFilter
                          )
                        )
                      }
                    }
                  })
                )

              // const removeFilter = (): void =>
              //   set(
              //     (state): ImmerSetReturnType => ({
              //       query: {
              //         ...state.query,
              //         filters: {
              //           ...state.query.filters,
              //           byType: pipe(
              //             newFilter,
              //             isAllFilterPredicate,
              //             O.match(
              //               () =>
              //                 flow(
              //                   hasOneFilterPredicate,
              //                   O.match(updateWithoutFilter, resetFilter)
              //                 )(newFilter),
              //               resetFilter
              //             )
              //           )
              //         }
              //       }
              //     })
              //   )
              return addFilter() //pipe(filterExists, O.match(addFilter, removeFilter))}
            },
          setLanguage:
            (newLng: string): IO<void> =>
            () => {
              const {
                clearDataverse,
                query: { setError }
              } = get()
              if (!newLng.length) {
                return setError(
                  O.some(
                    new Error(
                      `Oops.. An error occurred in <setLanguage> call.. Parameter cannot be empty: <${newLng}>..`
                    )
                  )
                )()
              }
              clearDataverse()()
              return set(
                (state): ImmerSetReturnType => ({
                  query: { ...state.query, language: newLng }
                })
              )
            }
        },
        clearDataverse: (): IO<void> => () =>
          set({
            dataverse: []
          }),
        addToDataverse:
          (newDataverse: DataverseEntity): IO<void> =>
          () =>
            set(
              (state): ImmerSetReturnType => ({
                dataverse: [...state.dataverse, ...newDataverse]
              })
            ),
        loadDataverse: (): T.Task<void> =>
          pipe(
            T.fromIO(() => {
              const { addToDataverse, query, dataverse } = get()
              const { setIsLoading, setHasNext, setError, limit, language, filters, isLoading } =
                query
              const offset = dataverse.length

              if (isLoading) {
                return T.of(undefined)
              }

              setIsLoading(true)()
              setError(O.none)()

              return pipe(
                gateway.retrieveDataverse(language, limit, offset, filters),
                TE.match(
                  e => {
                    setIsLoading(false)()
                    setError(O.some(e))()
                  },
                  r => {
                    setIsLoading(false)()
                    setHasNext(r.query.hasNext)()
                    addToDataverse(r.data)()
                  }
                )
              )
            }),
            T.flatten
          )
      })),
      {
        anonymousActionType: 'dataverseAggregate',
        enabled: import.meta.env.DEV
      }
    )
  )
