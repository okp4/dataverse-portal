import type * as TE from 'fp-ts/TaskEither'
import type { DataverseElement } from '@/domain/dataverse/entity'
import type { Option } from 'fp-ts/Option'

export type DataverseElementType = 'Zone' | 'Dataset' | 'Service'
export type ByTypeQueryFilter = DataverseElementType[] | 'all'

type ServiceCategoryVocab = 'Storage'
export type ByServiceCategoryQueryFilter = Option<ServiceCategoryVocab>

type FilterQueryProperty = 'title'
export type ByPropertyQueryFilter = {
  property: FilterQueryProperty
  value: string
} | null

export type RetrieveDataverseQueryFilters = {
  byType: ByTypeQueryFilter
  byProperty: ByPropertyQueryFilter
  byServiceCategory: ByServiceCategoryQueryFilter
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
