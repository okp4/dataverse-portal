import type { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import type { MetadataPort } from './port'

type DataverseItemId = string

// TODO: add metadata errors
export type LoadMetadataError = ErrorOptions

export type Deps = {
  metadataPort: MetadataPort
  language: string
}

export type Command = {
  // Load dataverse item general and audit metadata from outside
  retrieveDataverseItemMetadata: (
    dataverseItemId: DataverseItemId
  ) => ReaderTaskEither<Deps, LoadMetadataError, void>
}
