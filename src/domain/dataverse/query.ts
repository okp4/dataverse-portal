import type { IO } from 'fp-ts/lib/IO'
import type { IOOption } from 'fp-ts/lib/IOOption'

export type DataverseElementId = string
export type DataverseElement = {
  id: DataverseElementId
  properties: DataverseElementMetadata[]
}

export type DataverseElementMetadata = {
  property: string
  value: string
}

export type Dataverse = DataverseElement[]

export type DataverseQueryError = Error

export type DataverseElementType = 'DataSpace' | 'Dataset' | 'Service'
export type ByTypeQueryFilter = DataverseElementType[] | 'all'

export type DataverseQueryFilters = {
  byType: ByTypeQueryFilter
}

export type Query = {
  // Get the whole dataverse.
  dataverse: () => IO<Dataverse>
  // Tell if the query to retrieve the dataverse is loading or not
  isLoading: () => IO<boolean>
  // Tell if there is more elements to retrieve from the dataverse
  hasNext: () => IO<boolean>
  // Return the error that may have occurred while retrieving the dataverse
  error: () => IOOption<DataverseQueryError>
  // Return the dataverse filters' object
  filters: () => IO<DataverseQueryFilters>
}
