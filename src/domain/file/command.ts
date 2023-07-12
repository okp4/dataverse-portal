import type { ResourceConflictError, ResourceNotFoundError } from '@/shared/error'
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

export type Command = {
  // Store one or multiple files in memory
  storeFiles: (files: StoreFilesInput) => IOEither<ResourceConflictError, void>
  // Remove a file in memory by a given file id
  removeFile: (fileId: FileId) => IOEither<ResourceNotFoundError, void>
}
