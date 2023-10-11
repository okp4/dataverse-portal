import type { Option } from 'fp-ts/Option'

type DataverseElementType = 'Zone' | 'Dataset' | 'Service'
export type ByTypeQueryFilter = DataverseElementType[] | 'all'

type FilterProperty = 'title'
export type ByPropertyFilter = Option<{
  property: FilterProperty
  value: string
}>

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
  filters: DataverseQueryFilters
  language: string
}
