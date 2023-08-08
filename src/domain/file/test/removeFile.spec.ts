/* eslint-disable max-lines-per-function */
import * as FileDomain from '@/domain/file/domain'
import type { StoreApi } from 'zustand'
import type { FileId } from '../command'
import type { File } from '../entity'
import type { FilesDescriptor } from '../query'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import { ResourceNotFoundError, ShowResourceError } from '@/shared/error/resource'

type InitialProps = Readonly<{
  store: StoreApi<FileDomain.DomainAPI>
}>

type Data = {
  fileToRemove: FileId
  preloadedState: FileDomain.Options
  expectedFilesDescriptor: FilesDescriptor
  expectedHasStoredFiles: boolean
  error?: ResourceNotFoundError
}

const initStore = (initialState?: FileDomain.Options): InitialProps => {
  const store = FileDomain.storeFactory(initialState)
  return { store }
}

describe('Remove a file from memory', () => {
  // Commands inputs
  const fileToRemove1: FileId = '1'
  const fileToRemove2: FileId = '2'

  // Entities
  const file1: File = {
    id: '1',
    name: 'test1',
    size: 10000,
    type: 'png',
    path: 'test1.png',
    stream: new ReadableStream()
  }

  const file2: File = {
    id: '2',
    name: 'test2',
    size: 10000,
    type: 'png',
    path: 'test2.png',
    stream: new ReadableStream()
  }

  // Query handling
  const expectFilesDescriptor = (files: File[]): FilesDescriptor =>
    files.map(file => ({
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type
    }))

  describe.each`
    preloadedState                                | fileToRemove     | expectedFilesDescriptor           | expectedHasStoredFiles | error
    ${undefined}                                  | ${''}            | ${[]}                             | ${false}               | ${undefined}
    ${{ initialState: { data: [file1] } }}        | ${''}            | ${expectFilesDescriptor([file1])} | ${true}                | ${undefined}
    ${{ initialState: { data: [file1] } }}        | ${fileToRemove1} | ${[]}                             | ${false}               | ${undefined}
    ${{ initialState: { data: [file1, file2] } }} | ${fileToRemove2} | ${expectFilesDescriptor([file1])} | ${true}                | ${undefined}
    ${{ initialState: { data: [file1] } }}        | ${fileToRemove2} | ${expectFilesDescriptor([file1])} | ${true}                | ${ResourceNotFoundError(fileToRemove2)}
  `(
    `Given that there are a file to remove with a given id <$fileToRemove>`,
    ({
      preloadedState,
      fileToRemove,
      expectedFilesDescriptor,
      expectedHasStoredFiles,
      error
    }: Data): void => {
      const { store } = initStore(preloadedState)

      describe('When removing file', () => {
        test(`Then, expect files descriptor to be ${JSON.stringify(
          expectedFilesDescriptor
        )}`, () => {
          const result = store.getState().removeFile(fileToRemove)()
          expect(store.getState().filesDescriptor()()).toStrictEqual(expectedFilesDescriptor)
          expect(store.getState().hasStoredFiles()()).toBe(expectedHasStoredFiles)
          expect(result).toBeEither()
          if (error) {
            expect(result).toBeLeft()
            expect(result).toEqualLeft(error)

            const message = pipe(result, E.getOrElseW(ShowResourceError.show))
            expect(message).toStrictEqual(
              `Error ${error._tag}: Failed to handle resource with ID '${error.resourceId}' since it does not exist.`
            )
          } else {
            expect(result).toBeRight()
          }
        })
      })
    }
  )
})
