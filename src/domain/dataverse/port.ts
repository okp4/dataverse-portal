import type * as TE from 'fp-ts/TaskEither'
import type { DataverseEntity } from '@/domain/dataverse/entity'

export type RetrieveDataverseQueryFilters = {
  byType: 'all' | 'DataSpace' | 'Dataset' | 'Service'
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
