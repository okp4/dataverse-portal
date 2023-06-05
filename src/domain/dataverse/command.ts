import type { Task } from 'fp-ts/Task'
import type { IO } from 'fp-ts/IO'

export type DataverseElementType = 'DataSpace' | 'Dataset' | 'Service'
export type ByTypeFilterInput = DataverseElementType | 'all'

export type Command = {
  // Load the dataverse elements from outside
  loadDataverse: () => Task<void>
  // Cancel the loading of the dataverse elements
  cancelDataverseLoading: () => Task<void>
  // Set the language in which the dataverse should be translated to.
  setLanguage: (newLng: string) => IO<void>
  // Filter the dataverse by one or multiple element types
  setByTypeFilter: (newFilter: ByTypeFilterInput) => IO<void>
}
