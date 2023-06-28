/* eslint-disable max-lines-per-function */
import * as O from 'fp-ts/Option'
import * as IOE from 'fp-ts/IOEither'
import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import * as B from 'fp-ts/boolean'
import * as S from 'fp-ts/string'
import * as N from 'fp-ts/number'
import { contramap as eqContramap } from 'fp-ts/Eq'
import { flow, pipe } from 'fp-ts/lib/function'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { StoreApi } from 'zustand/vanilla'
import { createStore } from 'zustand/vanilla'
import type { File } from './entity'
import type { Command, FileId, StoreFileInput, StoreFilesInput } from './command'
import { ResourceConflictError, ResourceNotFoudError } from './command'
import type { ForgetType } from '@/util/type'
import { isDevMode } from '@/util/env.util'
import type { FileDescriptor, Query } from './query'
import type { Eq } from 'fp-ts/lib/Eq'

export type State = {
  data: File[]
}

type Domain = State & Command & Query
export type DomainAPI = ForgetType<State, Domain>

export type Options = {
  initialState: State
}

const eqFileId: Eq<FileId> = S.Eq
const eqFile: Eq<{ id: string }> = pipe(
  eqFileId,
  eqContramap(it => it.id)
)

const throwResourceConflictError = (): ResourceConflictError => ResourceConflictError()
const throwResourceNotFoundError = (fileId: FileId): ResourceNotFoudError =>
  ResourceNotFoudError(fileId)

const isStoreFilesPayloadUniq = (files: StoreFilesInput): boolean =>
  N.Eq.equals(A.uniq(eqFile)(files).length, files.length)

const isStoreFilesIdUniq =
  (files: StoreFilesInput) =>
  (state: File[]): boolean =>
    !A.some((fileEntity: File) =>
      A.some((filePayload: StoreFileInput) => filePayload.id === fileEntity.id)(files)
    )(state)

const removeFileIdExists =
  (state: File[]) =>
  (fileId: FileId): boolean =>
    A.some((file: File) => file.id === fileId)(state)

const removeFileInvariant = (
  fileId: FileId,
  state: File[]
): E.Either<ResourceNotFoudError, FileId> =>
  pipe(fileId, E.fromPredicate(flow(removeFileIdExists(state)), throwResourceNotFoundError))

const storeFilesInvariant = (
  files: StoreFilesInput,
  state: File[]
): E.Either<ResourceConflictError, StoreFilesInput> =>
  pipe(
    files,
    E.fromPredicate(flow(isStoreFilesIdUniq(state)), throwResourceConflictError),
    E.flatMap(flow(E.fromPredicate(isStoreFilesPayloadUniq, throwResourceConflictError)))
  )

const mapFileToFileDescriptor = (file: File): FileDescriptor => ({
  id: file.id,
  name: file.name,
  size: file.size,
  type: file.type
})

export const storeFactory = ({ initialState }: Partial<Options> = {}): StoreApi<DomainAPI> =>
  createStore(
    devtools(
      immer<Domain>((set, get) => ({
        data: pipe(
          initialState,
          O.fromNullable,
          O.map(it => it.data),
          O.getOrElse<File[]>(() => [])
        ),
        storeFiles: (payload: StoreFilesInput) =>
          pipe(
            payload,
            A.isEmpty,
            B.match(
              () =>
                pipe(
                  IOE.fromIO(() => get().data),
                  IOE.flatMap(files =>
                    pipe(
                      IOE.fromEither(storeFilesInvariant(payload, files)),
                      IOE.chainIOK(
                        f => () => set(state => ({ data: pipe(state.data, A.concat(f)) }))
                      )
                    )
                  )
                ),
              () => IOE.of(undefined)
            )
          ),
        removeFile: (payload: FileId) =>
          pipe(
            payload,
            S.isEmpty,
            B.match(
              () =>
                pipe(
                  IOE.fromIO(() => get().data),
                  IOE.flatMap(files =>
                    pipe(
                      IOE.fromEither(removeFileInvariant(payload, files)),
                      IOE.chainIOK(
                        fileId => () =>
                          set(state => ({
                            data: pipe(
                              state.data,
                              A.filter(file => file.id !== fileId)
                            )
                          }))
                      )
                    )
                  )
                ),
              () => IOE.of(undefined)
            )
          ),
        filesDescriptor: () => () => pipe(get().data, A.map(mapFileToFileDescriptor))
      })),
      {
        anonymousActionType: 'Aggregate',
        name: 'file',
        enabled: isDevMode()
      }
    )
  )
