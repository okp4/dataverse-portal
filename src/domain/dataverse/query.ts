import type { IO } from 'fp-ts/lib/IO'

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

export type DataverseElementType = 'Zone' | 'Dataset' | 'Service'
export type ByTypeQueryFilter = DataverseElementType[] | 'all'

export type Query = {
  // Get the whole dataverse.
  dataverse: () => IO<Dataverse>
  // Tell if the query to retrieve the dataverse is loading or not
  isLoading: () => IO<boolean>
  // Tell if there is more elements to retrieve from the dataverse
  hasNext: () => IO<boolean>
  // Return the dataverse by type filter
  byTypeFilter: () => IO<ByTypeQueryFilter>
  // Return the dataverse filter value according to the property
  byPropertyFilter: () => IO<string>
}
