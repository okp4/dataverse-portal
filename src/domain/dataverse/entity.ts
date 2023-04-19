export type DataverseElementId = string

export type DataverseEntity = DataverseElement[]

export type DataverseElement = {
  id: DataverseElementId
  properties: DataverseElementMetadata[]
}

type DataverseElementMetadata = {
  property: string
  value: string
}
