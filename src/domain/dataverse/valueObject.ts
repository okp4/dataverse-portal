import type { Option } from 'fp-ts/Option'

type DataverseQueryError = Error

type DataverseElementType = 'DataSpace' | 'Dataset' | 'Service'
export type ByTypeQueryFilter = DataverseElementType[] | 'all'

type DataverseQueryFilters = {
  byType: ByTypeQueryFilter
}

export type DataverseQuery = {
  limit: number
  hasNext: boolean
  isLoading: boolean
  error: Option<DataverseQueryError>
  filters: DataverseQueryFilters
  language: string
}
