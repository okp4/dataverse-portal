import type { IO } from 'fp-ts/lib/IO'

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

export type GeneralMetadataItem = {
  property: GeneralMetadataProperty
  value: string | string[] | [string, string]
}

export type AuditMetadataItem = {
  property: AuditMetadataProperty
  value: string
}

export type Query = {
  // Get the dataverse item audit metadata
  auditMetadata: () => IO<AuditMetadataItem[]>
  // Get the dataverse item general metadata
  generalMetadata: () => IO<GeneralMetadataItem[]>
  // Tell if the query to retrieve dataverse item metadata is loading or not
  isLoading: () => IO<boolean>
}
