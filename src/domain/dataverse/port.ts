import type * as TE from 'fp-ts/TaskEither'
import type { DataverseElement } from '@/domain/dataverse/entity'

export type DataverseElementType = 'DataSpace' | 'Dataset' | 'Service'
export type ByTypeQueryFilter = DataverseElementType[] | 'all'

export type RetrieveDataverseQueryFilters = {
  byType: ByTypeQueryFilter
}

export type RetrieveDataverseResult = { data: DataverseElement[]; query: { hasNext: boolean } }

export type DataversePort = {
  retrieveDataverse: (
    language: string,
    limit: number,
    offset: number,
    filters: RetrieveDataverseQueryFilters
  ) => TE.TaskEither<Error, RetrieveDataverseResult>
  cancelDataverseRetrieval: () => void
}
