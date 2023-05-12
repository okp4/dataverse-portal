import type * as TE from 'fp-ts/TaskEither'
import type { DataverseEntity } from '@/domain/dataverse/entity'
import type { ByTypeQueryFilter, DataverseElementType } from './aggregate'

export type RetrieveDataverseByTypeQueryFilter = ByTypeQueryFilter
export type DataverseElementTypeFilter = DataverseElementType

export type RetrieveDataverseQueryFilters = {
  byType: RetrieveDataverseByTypeQueryFilter
}

export type RetrieveDataverseResult = { data: DataverseEntity; query: { hasNext: boolean } }

export type DataversePort = {
  retrieveDataverse: (
    language: string,
    limit: number,
    offset: number,
    filters: RetrieveDataverseQueryFilters
  ) => TE.TaskEither<Error, RetrieveDataverseResult>
}
