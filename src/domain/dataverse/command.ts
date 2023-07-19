import type { Task } from 'fp-ts/Task'
import type { IO } from 'fp-ts/IO'
import type { Option } from 'fp-ts/Option'

type FilterProperty = 'title'

export type DataverseElementType = 'Zone' | 'Dataset' | 'Service'
export type ByTypeFilterInput = DataverseElementType | 'all'
export type ByPropertyFilterInput = {
  property: FilterProperty
  value: string
}

export type ServiceCategoryVocab = 'Storage'
export type ByServiceCategoryFilter = Option<ServiceCategoryVocab>

export type Command = {
  // Load the dataverse elements from outside
  loadDataverse: () => Task<void>
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
