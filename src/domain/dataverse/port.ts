import type * as TE from 'fp-ts/TaskEither'
import type { DataverseElement } from '@/domain/dataverse/entity'

export type DataverseElementType = 'Zone' | 'Dataset' | 'Service'
export type ByTypeQueryFilter = DataverseElementType[] | 'all'

type FilterQueryProperty = 'title'
export type ByPropertyQueryFilter = {
  property: FilterQueryProperty
  value: string
} | null

export type RetrieveDataverseQueryFilters = {
  byType: ByTypeQueryFilter
  byProperty: ByPropertyQueryFilter
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
