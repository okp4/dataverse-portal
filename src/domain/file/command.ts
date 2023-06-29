import type { IOEither } from 'fp-ts/IOEither'

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

export const ResourceConflictError = () =>
  ({
    _tag: 'resource-conflict'
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
