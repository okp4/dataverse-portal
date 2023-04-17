/* eslint-disable max-lines-per-function */
import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import type * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import { immer } from 'zustand/middleware/immer'
import { createStore } from 'zustand/vanilla'
import type { DataverseDTO } from './dto'
import type { DataverseEntity } from './entity'
import type { DataversePort } from './port'

type ByTypeQueryFilter = 'all' | 'DataSpace' | 'Dataset' | 'Service'

type DataverseQueryFilters = {
  byType: ByTypeQueryFilter
}

type DataverseQueryError = Error | null

type DataverseQuery = {
  limit: number
  hasNext: boolean
  isLoading: boolean
  error: DataverseQueryError
  filters: DataverseQueryFilters
  language: string
  setIsLoading: (isLoading: boolean) => void
  setHasNext: (hasNext: boolean) => void
  setError: (error: DataverseQueryError) => void
  setFilters: (newFilter: DataverseQueryFilters) => void
  setLanguage: (newLng: string) => void
}

export type DataverseAggregate = {
  dataverse: DataverseEntity
  query: DataverseQuery
  addToDataverse: (newDataverse: DataverseEntity) => void
  clearDataverse: () => void
  loadDataverse: () => T.Task<void> | void
}

// Public contract with the controller that consumes the store
export type DataverseStore = {
  query: {
    hasNext: boolean
    isLoading: boolean
    error: DataverseQueryError
    filters: DataverseQueryFilters
    setFilters: (newFilter: DataverseQueryFilters) => void
    setLanguage: (newLng: string) => void
  }
  dataverse: DataverseDTO
  loadDataverse: () => T.Task<void> | void
}

type ImmerSetReturnType = Partial<DataverseAggregate>

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const dataverseAggregate = (gateway: DataversePort) =>
  createStore<DataverseAggregate, [['zustand/immer', never]]>(
    immer<DataverseAggregate>((set, get) => ({
      dataverse: [],
      query: {
        limit: 21,
        hasNext: false,
        isLoading: false,
        error: null,
        filters: { byType: 'all' },
        language: 'en',
        setIsLoading: (isLoading: boolean): void =>
          set(
            (state): ImmerSetReturnType => ({
              query: { ...state.query, isLoading }
            })
          ),
        setHasNext: (hasNext: boolean): void =>
          set(
            (state): ImmerSetReturnType => ({
              query: { ...state.query, hasNext }
            })
          ),
        setError: (error: DataverseQueryError): void =>
          set(
            (state): ImmerSetReturnType => ({
              query: { ...state.query, error }
            })
          ),
        setFilters: (newFilters: DataverseQueryFilters): void => {
          const { clearDataverse } = get()
          clearDataverse()
          return set(
            (state): ImmerSetReturnType => ({
              query: { ...state.query, filters: { ...state.query.filters, ...newFilters } }
            })
          )
        },
        setLanguage: (newLng: string): void => {
          const {
            clearDataverse,
            query: { setError }
          } = get()
          if (!newLng.length) {
            return setError(
              new Error(
                `Oops.. An error occurred in <setLanguage> call.. Parameter cannot be empty: <${newLng}>..`
              )
            )
          }
          clearDataverse()
          return set(
            (state): ImmerSetReturnType => ({
              query: { ...state.query, language: newLng }
            })
          )
        }
      },
      clearDataverse: (): void =>
        set(
          (): ImmerSetReturnType => ({
            dataverse: []
          })
        ),
      addToDataverse: (newDataverse: DataverseEntity): void =>
        set(
          (state): ImmerSetReturnType => ({
            dataverse: [...state.dataverse, ...newDataverse]
          })
        ),
      loadDataverse: (): T.Task<void> | void => {
        const { addToDataverse, query, dataverse } = get()
        const { setIsLoading, setHasNext, setError, limit, language, filters } = query
        const offset = dataverse.length

        setIsLoading(true)
        setError(null)

        const checkLanguageInvariant = (): E.Either<Error, void> =>
          pipe(
            E.tryCatch(
              () => {
                if (!language.length) {
                  throw new Error(
                    'Oops.. An error occurred when trying to load Dataverse.. Language cannot be empty..'
                  )
                }
              },
              reason =>
                reason instanceof Error
                  ? reason
                  : new Error('Oops.. An unspecified error occurred..')
            )
          )

        const fetchDataverse = (): T.Task<void> =>
          pipe(
            gateway.retrieveDataverse(language, limit, offset, filters),
            TE.match(
              e => {
                setIsLoading(false)
                setError(e)
              },
              r => {
                setIsLoading(false)
                setHasNext(r.query.hasNext)
                addToDataverse(r.data)
              }
            )
          )

        return pipe(
          checkLanguageInvariant(),
          E.matchW(e => setError(e), fetchDataverse)
        )
      }
    }))
  )
