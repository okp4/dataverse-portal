import type * as TE from 'fp-ts/TaskEither'
import type { DataverseEntity } from '@/domain/dataverse/entity'

const retrieveDataverseByTypeQueryFilter = ['all', 'DataSpace', 'Dataset', 'Service'] as const
export type RetrieveDataverseByTypeQueryFilter = (typeof retrieveDataverseByTypeQueryFilter)[number]

export type RetrieveDataverseQueryFilters = {
  byType: RetrieveDataverseByTypeQueryFilter[]
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
