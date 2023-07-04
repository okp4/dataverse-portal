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

export const ResourceConflictError = (fileIds: FileId[]) =>
  ({
    _tag: 'resource-conflict',
    fileIds
  } as const)

/**
 *  Error thrown when an id of a file to be stored already exists in memory,
 *  or if multiple files in the StoreFileInput payload have the same id
 */
export type ResourceConflictError = ReturnType<typeof ResourceConflictError>

export const ResourceNotFoundError = (fileId: FileId) =>
  ({
    _tag: 'resource-not-found',
    fileId
  } as const)

/**
 *  Error thrown when the id of a file to be removed is not found in the list of stored files in memory.
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
        return `Oops... You are trying either to store a file whose id already exists in memory or to store files with the same id... So we can't store these files with these ids: [${error.fileIds}]`
      }
      case 'resource-not-found': {
        return `Oops... The provided id '${error.fileId}' does not exist in memory... So we can't remove this file...`
      }
    }
  }
}
