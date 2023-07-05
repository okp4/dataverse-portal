import type { IOEither } from 'fp-ts/IOEither'
import type { Show } from 'fp-ts/lib/Show'

export type MediaType = string

export type FileId = string

export type StoreFileInput = {
  id: FileId
  name: string
  path: string
  size: number
  type: MediaType
  stream: ReadableStream
}

export type StoreFilesInput = StoreFileInput[]

export const ResourceConflictError = (resourceIds: FileId[]) =>
  ({
    _tag: 'resource-conflict',
    resourceIds
  } as const)

/**
 *  Error when an id of a file to be stored already exists in memory,
 *  or if multiple files in the StoreFileInput payload have the same id
 */
export type ResourceConflictError = ReturnType<typeof ResourceConflictError>

export const ResourceNotFoundError = (resourceId: FileId) =>
  ({
    _tag: 'resource-not-found',
    resourceId
  } as const)

/**
 *  Error when the id of a file to be removed is not found in the list of stored files in memory.
 */
export type ResourceNotFoundError = ReturnType<typeof ResourceNotFoundError>

export type Command = {
  // Store one or multiple files in memory
  storeFiles: (files: StoreFilesInput) => IOEither<ResourceConflictError, void>
  // Remove a file in memory by a given file id
  removeFile: (fileId: FileId) => IOEither<ResourceNotFoundError, void>
}

export type FileError = ResourceConflictError | ResourceNotFoundError

export const ShowFileError: Show<FileError> = {
  show: (error: FileError): string => {
    switch (error._tag) {
      case 'resource-conflict': {
        return `Error ${
          error._tag
        }: Failed to store resource with conflicting IDs [${error.resourceIds.join(', ')}].`
      }
      case 'resource-not-found': {
        return `Error ${error._tag}: Failed to remove resource with ID '${error.resourceId}' since it does not exist.`
      }
    }
  }
}
