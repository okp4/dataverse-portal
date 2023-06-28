/* eslint-disable max-lines-per-function */
import * as FileDomain from '@/domain/file/domain'
import type { StoreApi } from 'zustand'
import type { FileId } from '../command'
import { ResourceNotFoudError } from '../command'
import type { File } from '../entity'
import type { FilesDescriptor } from '../query'

type InitialProps = Readonly<{
  store: StoreApi<FileDomain.DomainAPI>
}>

type Data = {
  fileToRemove: FileId
  preloadedState: FileDomain.Options
  expectedFilesDescriptor: FilesDescriptor
  error?: ResourceNotFoudError
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
    preloadedState                                | fileToRemove     | expectedFilesDescriptor           | error
    ${undefined}                                  | ${''}            | ${[]}                             | ${undefined}
    ${{ initialState: { data: [file1] } }}        | ${''}            | ${expectFilesDescriptor([file1])} | ${undefined}
    ${{ initialState: { data: [file1] } }}        | ${fileToRemove1} | ${[]}                             | ${undefined}
    ${{ initialState: { data: [file1, file2] } }} | ${fileToRemove2} | ${expectFilesDescriptor([file1])} | ${undefined}
    ${{ initialState: { data: [file1] } }}        | ${fileToRemove2} | ${expectFilesDescriptor([file1])} | ${ResourceNotFoudError(fileToRemove2)}
  `(
    `Given that there are a file to remove with a given id <$fileToRemove>`,
    ({ preloadedState, fileToRemove, expectedFilesDescriptor, error }: Data): void => {
      const { store } = initStore(preloadedState)

      describe('When removing file', () => {
        test(`Then, expect files descriptor to be ${JSON.stringify(
          expectedFilesDescriptor
        )}`, () => {
          const result = store.getState().removeFile(fileToRemove)()
          expect(store.getState().filesDescriptor()()).toStrictEqual(expectedFilesDescriptor)
          expect(result).toBeEither()
          if (error) {
            expect(result).toBeLeft()
            expect(result).toEqualLeft(error)
          } else {
            expect(result).toBeRight()
          }
        })
      })
    }
  )
})
