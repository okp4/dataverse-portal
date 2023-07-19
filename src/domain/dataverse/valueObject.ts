import type { Option } from 'fp-ts/Option'

type DataverseQueryError = Error

type DataverseElementType = 'Zone' | 'Dataset' | 'Service'
export type ByTypeQueryFilter = DataverseElementType[] | 'all'

type FilterProperty = 'title'
export type ByPropertyFilter = {
  property: FilterProperty
  value: string
} | null

type ServiceCategoryVocab = 'Storage'
export type ByServiceCategoryFilter = Option<ServiceCategoryVocab>

type DataverseQueryFilters = {
  byType: ByTypeQueryFilter
  byProperty: ByPropertyFilter
  byServiceCategory: ByServiceCategoryFilter
}

export type DataverseQuery = {
  limit: number
  hasNext: boolean
  isLoading: boolean
  error: Option<DataverseQueryError>
  filters: DataverseQueryFilters
  language: string
}
