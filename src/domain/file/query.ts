import type { IO } from 'fp-ts/lib/IO'

export type FileId = string
export type MediaType = string

export type FileDescriptor = {
  id: FileId
  name: string
  size: number
  type: MediaType
}

export type FilesDescriptor = FileDescriptor[]

export type Query = {
  // Get the base properties of in memory files.
  filesDescriptor: () => IO<FilesDescriptor>
  // Tell if, at least, one file is stored
  hasStoredFile: () => IO<boolean>
}
