/* eslint-disable max-lines-per-function */
import { PayloadIsEmptyError, ShowPayloadError } from '@/shared/error/payload'
import { ResourceAlreadyExistsError, ShowResourceError } from '@/shared/error/resource'
import type { Form, InitFormPayload, ShareDataSlice, StorageServiceId } from '../shareData.slice'
import type { StoreApi } from 'zustand'
import * as App from '@/ui/store/appStore'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import type { AppOptions } from '@/ui/store/appStore'

type Data1 = {
  initialFormPayload?: InitFormPayload
  expectedForm: Form
  expectIsFormInitialized: boolean
  expectedIsEmptyPayloadError?: PayloadIsEmptyError
  expectedAlreadyExistsError?: ResourceAlreadyExistsError
  preloadedState?: AppOptions
}

type Data2 = {
  serviceStorageIdPayload: O.Option<StorageServiceId>
  expectedServiceStorageId: O.Option<StorageServiceId>
  expectedIsEmptyPayloadError?: PayloadIsEmptyError
  preloadedState?: AppOptions
}

type Store = Readonly<{
  store: StoreApi<ShareDataSlice>
}>

const initStore = (initialState?: AppOptions): Store => {
  const store = App.storeFactory(initialState)
  return { store }
}

// eslint-disable-next-line max-lines-per-function
describe('Given the share data slice', () => {
  // init form payloads
  const initialFormPayload1: InitFormPayload = [
    { id: '1', title: 'title', required: true, type: 'text', value: O.none }
  ]

  const initialFormPayload2: InitFormPayload = [
    { id: '1', title: 'title', required: true, type: 'text', value: O.none },
    { id: '1', title: 'author', required: true, type: 'text', value: O.none }
  ]

  // expected forms
  const expectedForm1: Form = initialFormPayload1

  // already existant form
  const existantForm1: Form = [
    {
      id: '1',
      title: 'fee',
      required: true,
      type: 'numeric',
      value: O.some(3)
    }
  ]

  // preloaded states
  const preloadedStateWithForm: AppOptions = {
    initialState: {
      shareData: {
        initialState: {
          data: { form: existantForm1, storageServiceId: O.none }
        }
      }
    }
  }

  const preloadedStateWithServicestorageId1: AppOptions = {
    initialState: {
      shareData: {
        initialState: {
          data: { form: [], storageServiceId: O.some('1') }
        }
      }
    }
  }

  describe.each`
    preloadedState            | initialFormPayload     | expectedForm     | expectIsFormInitialized | expectedIsEmptyPayloadError | expectedAlreadyExistsError
    ${[]}                     | ${[]}                  | ${[]}            | ${false}                | ${PayloadIsEmptyError([])}  | ${undefined}
    ${[]}                     | ${initialFormPayload2} | ${[]}            | ${false}                | ${undefined}                | ${ResourceAlreadyExistsError(['1', '1'])}
    ${[]}                     | ${initialFormPayload1} | ${expectedForm1} | ${true}                 | ${undefined}                | ${undefined}
    ${preloadedStateWithForm} | ${initialFormPayload1} | ${expectedForm1} | ${true}                 | ${undefined}                | ${ResourceAlreadyExistsError(['1'])}
  `(
    'Given an initial form payload <$initialFormPayload>',
    ({
      initialFormPayload,
      expectedForm,
      expectIsFormInitialized,
      expectedIsEmptyPayloadError,
      expectedAlreadyExistsError,
      preloadedState
    }: Data1) => {
      describe('When initializing a form', () => {
        const { store } = initStore(preloadedState)

        test(`Then expect initialized form to be ${JSON.stringify(expectedForm)}`, () => {
          if (initialFormPayload) {
            const result = store.getState().shareData.initForm(initialFormPayload)()
            const { form, isFormInitialized } = store.getState().shareData

            if (expectedIsEmptyPayloadError) {
              expect(result).toStrictEqualLeft(expectedIsEmptyPayloadError)
              const message = pipe(
                result as E.Either<PayloadIsEmptyError, void>,
                E.getOrElseW(ShowPayloadError.show)
              )
              expect(message).toStrictEqual(
                `Error ${
                  expectedIsEmptyPayloadError._tag
                }: Failed to execute command with an empty payload: ${JSON.stringify(
                  expectedIsEmptyPayloadError.payload
                )}.`
              )
              expect(expectedAlreadyExistsError).toStrictEqual(undefined)
            } else if (expectedAlreadyExistsError) {
              expect(result).toStrictEqualLeft(expectedAlreadyExistsError)
              const message = pipe(
                result as E.Either<ResourceAlreadyExistsError, void>,
                E.getOrElseW(ShowResourceError.show)
              )
              expect(message).toStrictEqual(
                `Error ${
                  expectedAlreadyExistsError._tag
                }: Failed to store resource with conflicting IDs [${expectedAlreadyExistsError.resourceIds.join(
                  ', '
                )}].`
              )
            } else {
              expect(result).toBeRight()
              expect(form).toStrictEqual(expectedForm)
              expect(isFormInitialized()()).toBe(expectIsFormInitialized)
            }
          }
        })
      })
    }
  )

  describe.each`
    preloadedState                         | serviceStorageIdPayload | expectedServiceStorageId | expectedIsEmptyPayloadError
    ${undefined}                           | ${O.none}               | ${O.none}                | ${undefined}
    ${undefined}                           | ${O.some('3')}          | ${O.some('3')}           | ${undefined}
    ${undefined}                           | ${O.some('')}           | ${O.none}                | ${PayloadIsEmptyError('')}
    ${preloadedStateWithServicestorageId1} | ${O.some('2')}          | ${O.some('2')}           | ${undefined}
    ${preloadedStateWithServicestorageId1} | ${O.some('')}           | ${O.some('1')}           | ${PayloadIsEmptyError('')}
  `(
    'Given an initial storage service id payload <$serviceStorageIdPayload>',
    ({
      serviceStorageIdPayload,
      expectedServiceStorageId,
      expectedIsEmptyPayloadError,
      preloadedState
    }: Data2) => {
      describe('When calling set method with this payload', () => {
        const { store } = initStore(preloadedState)
        const setStorageIdResult = store
          .getState()
          .shareData.setStorageServiceId(serviceStorageIdPayload)()
        const serviceStorageId = store.getState().shareData.storageServiceId

        test(`Then, we expect service storage id to be ${JSON.stringify(
          expectedServiceStorageId
        )}`, () => {
          if (expectedIsEmptyPayloadError) {
            expect(setStorageIdResult).toStrictEqualLeft(expectedIsEmptyPayloadError)
            const message = pipe(
              setStorageIdResult as E.Either<PayloadIsEmptyError, void>,
              E.getOrElseW(ShowPayloadError.show)
            )
            expect(message).toStrictEqual(
              `Error ${
                expectedIsEmptyPayloadError._tag
              }: Failed to execute command with an empty payload: ${JSON.stringify(
                expectedIsEmptyPayloadError.payload
              )}.`
            )
          } else {
            expect(setStorageIdResult).toBeRight()
          }
          expect(serviceStorageId).toStrictEqual(expectedServiceStorageId)
        })
      })
    }
  )
})
