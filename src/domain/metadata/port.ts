import type * as TE from 'fp-ts/TaskEither'
import type { MetadataItem } from './entity'

type DataverseItemId = string

export type MetadataPort = {
  // TODO: add metadata errors
  retrieveMetadata: (
    dataverseItemId: DataverseItemId,
    language: string
  ) => TE.TaskEither<Error, MetadataItem[]>
}
