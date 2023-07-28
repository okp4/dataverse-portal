import type { TaskEither } from 'fp-ts/TaskEither'
import type { IO } from 'fp-ts/IO'
import type { Option } from 'fp-ts/Option'
import type {
  HTTPNetworkError,
  NetworkRequestAbortedError,
  NetworkUnspecifiedError
} from '@/shared/network'
import type { ResponseToJsonSerializationError } from '@/shared/serialize'

type FilterProperty = 'title'

export type DataverseElementType = 'Zone' | 'Dataset' | 'Service'
export type ByTypeFilterInput = DataverseElementType | 'all'
export type ByPropertyFilterInput = {
  property: FilterProperty
  value: string
}

export type ServiceCategoryVocab = 'Storage'
export type ByServiceCategoryFilter = Option<ServiceCategoryVocab>

export type LoadDataverseError =
  | HTTPNetworkError
  | NetworkUnspecifiedError
  | ResponseToJsonSerializationError
  | NetworkRequestAbortedError

export type Command = {
  // Load the dataverse elements from outside
  loadDataverse: () => TaskEither<LoadDataverseError, void>
  // Set the language in which the dataverse should be translated to.
  setLanguage: (newLng: string) => IO<void>
  // Filter the dataverse by one or multiple element types
  setByTypeFilter: (newFilter: ByTypeFilterInput) => IO<void>
  // Filter the dataverse by an enumerated property
  setByPropertyFilter: (newFilter: ByPropertyFilterInput) => IO<void>
  // Filter the dataverse by a service category controlled vocabulary
  setByServiceCategoryFilter: (newFilter: ByServiceCategoryFilter) => IO<void>
  // Reset the by type filter
  resetByTypeFilter: () => IO<void>
  // Reset the by property filter
  resetByPropertyFilter: () => IO<void>
  // Reset the by service category filter
  resetByServiceCategoryFilter: () => IO<void>
}
