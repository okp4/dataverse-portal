export type DataverseDTO = Array<{
  id: string
  properties: DataverseDTOMetadata[]
}>

export type DataverseDTOMetadata = {
  property: string
  value: string
}
