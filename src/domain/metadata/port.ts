import type * as TE from 'fp-ts/TaskEither'
import type { MetadataItem } from './entity'
import type { NetworkError } from '@/shared/error/network'
import type { SerializationError } from '@/shared/error/serialize'

type DataverseItemId = string

export type LoadMetadataError = SerializationError | NetworkError

export type MetadataPort = {
  retrieveMetadata: (
    dataverseItemId: DataverseItemId,
    language: string
  ) => TE.TaskEither<LoadMetadataError, MetadataItem[]>
}
