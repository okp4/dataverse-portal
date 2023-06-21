import type { Option } from 'fp-ts/Option'

type DataverseQueryError = Error

type DataverseElementType = 'DataSpace' | 'Dataset' | 'Service'
export type ByTypeQueryFilter = DataverseElementType[] | 'all'

type FilterProperty = 'title'
export type ByPropertyFilter = {
  property: FilterProperty
  value: string
} | null

type DataverseQueryFilters = {
  byType: ByTypeQueryFilter
  byProperty: ByPropertyFilter
}

export type DataverseQuery = {
  limit: number
  hasNext: boolean
  isLoading: boolean
  error: Option<DataverseQueryError>
  filters: DataverseQueryFilters
  language: string
}
