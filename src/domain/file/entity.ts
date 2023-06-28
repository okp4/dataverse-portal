export type MediaType = string

export type File<I = string> = {
  id: I
  name: string
  path: string
  size: number
  type: MediaType
  stream: ReadableStream
}
