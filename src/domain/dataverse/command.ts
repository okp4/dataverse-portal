import type { Task } from 'fp-ts/Task'
import type { IO } from 'fp-ts/IO'

type FilterProperty = 'title'

export type DataverseElementType = 'Zone' | 'Dataset' | 'Service'
export type ByTypeFilterInput = DataverseElementType | 'all'
export type ByPropertyFilterInput = {
  property: FilterProperty
  value: string
}

export type Command = {
  // Load the dataverse elements from outside
  loadDataverse: () => Task<void>
  // Set the language in which the dataverse should be translated to.
  setLanguage: (newLng: string) => IO<void>
  // Filter the dataverse by one or multiple element types
  setByTypeFilter: (newFilter: ByTypeFilterInput) => IO<void>
  // Filter the dataverse by an enumerated property
  setByPropertyFilter: (newFilter: ByPropertyFilterInput) => IO<void>
}
