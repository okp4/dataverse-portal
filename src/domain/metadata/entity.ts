export type AuditMetadataProperty = 'createdBy' | 'createdOn' | 'lastModifiedBy' | 'updatedOn'
export type GeneralMetadataProperty =
  | 'category'
  | 'creator'
  | 'description'
  | 'format'
  | 'image'
  | 'license'
  | 'publisher'
  | 'spatialCoverage'
  | 'tags'
  | 'temporalCoverage'
  | 'title'
  | 'topic'

export type MetadataProperty = GeneralMetadataProperty | AuditMetadataProperty

export type Category = 'generalMetadata' | 'auditMetadata'

export type AuditMetadataItem = {
  category: 'auditMetadata'
  property: AuditMetadataProperty
  value: string
}

export type GeneralMetadataItem = {
  category: 'generalMetadata'
  property: GeneralMetadataProperty
  value: string | string[] | [string, string]
}

export type MetadataItem = {
  category: Category
  property: MetadataProperty
  value: string | string[] | [string, string]
}

export type Metadata = {
  data: MetadataItem[]
  isLoading: boolean
}
