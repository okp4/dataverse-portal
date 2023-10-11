import type { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import type { MetadataPort } from './port'
import type { SerializationError } from '@/shared/error/serialize'
import type { NetworkError } from '@/shared/error/network'

type DataverseItemId = string

export type LoadMetadataError = SerializationError | NetworkError

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
