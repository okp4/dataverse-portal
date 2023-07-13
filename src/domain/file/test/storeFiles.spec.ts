/* eslint-disable max-lines-per-function */
import * as FileDomain from '@/domain/file/domain'
import type { StoreApi } from 'zustand'
import type { StoreFileInput, StoreFilesInput } from '../command'
import type { File } from '../entity'
import type { FilesDescriptor } from '../query'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import { ResourceAlreadyExistsError, ShowFileError } from '@/shared/error'

type InitialProps = Readonly<{
  store: StoreApi<FileDomain.DomainAPI>
}>

type Data = {
  filesToStore: StoreFilesInput
  preloadedState: FileDomain.Options
  expectedFilesDescriptor: FilesDescriptor
  error?: ResourceAlreadyExistsError
}

const initStore = (initialState?: FileDomain.Options): InitialProps => {
  const store = FileDomain.storeFactory(initialState)
  return { store }
}

describe('Store files in memory', () => {
  // Commands inputs
  const fileToStore1: StoreFileInput = {
    id: '1',
    name: 'test1',
    size: 10000,
    type: 'png',
    path: 'test1.png',
    stream: new ReadableStream()
  }

  const fileToStore2: StoreFileInput = {
    id: '2',
    name: 'test2',
    size: 10000,
    type: 'png',
    path: 'test2.png',
    stream: new ReadableStream()
  }

  const fileToStore3: StoreFileInput = {
    id: '1',
    name: 'test3',
    size: 10000,
    type: 'png',
    path: 'test3.png',
    stream: new ReadableStream()
  }

  // Entities
  const file1 = fileToStore1 as File
  const file2 = fileToStore2 as File

  // Query handling
  const expectFilesDescriptor = (files: File[]): FilesDescriptor =>
    files.map(file => ({
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type
    }))

  describe.each`
    preloadedState                         | filesToStore                    | expectedFilesDescriptor                  | error
    ${undefined}                           | ${[]}                           | ${[]}                                    | ${undefined}
    ${{ initialState: { data: [file1] } }} | ${[]}                           | ${expectFilesDescriptor([file1])}        | ${undefined}
    ${undefined}                           | ${[fileToStore1]}               | ${expectFilesDescriptor([file1])}        | ${undefined}
    ${undefined}                           | ${[fileToStore1, fileToStore2]} | ${expectFilesDescriptor([file1, file2])} | ${undefined}
    ${{ initialState: { data: [file1] } }} | ${[fileToStore3]}               | ${expectFilesDescriptor([file1])}        | ${ResourceAlreadyExistsError([fileToStore3.id])}
    ${undefined}                           | ${[fileToStore1, fileToStore3]} | ${[]}                                    | ${ResourceAlreadyExistsError([fileToStore1.id, fileToStore3.id])}
  `(
    `Given that there are $filesToStore.length file(s) to store`,
    ({ preloadedState, filesToStore, expectedFilesDescriptor, error }: Data): void => {
      const { store } = initStore(preloadedState)

      describe('When storing files', () => {
        test(`Then, expect files descriptor to be ${JSON.stringify(
          expectedFilesDescriptor
        )}`, () => {
          const result = store.getState().storeFiles(filesToStore)()
          expect(store.getState().filesDescriptor()()).toStrictEqual(expectedFilesDescriptor)
          expect(result).toBeEither()
          if (error) {
            expect(result).toBeLeft()
            expect(result).toEqualLeft(error)

            const message = pipe(
              result,
              E.getOrElseW(e => ShowFileError.show(e))
            )
            expect(message).toStrictEqual(
              `Error ${
                error._tag
              }: Failed to store resource with conflicting IDs [${error.resourceIds.join(', ')}].`
            )
          } else {
            expect(result).toBeRight()
          }
        })
      })
    }
  )
})
