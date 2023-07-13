/**
 * @jest-environment jsdom
 */
/* eslint-disable max-lines-per-function */

import type {
  Form,
  initFormPayload,
  FormItem,
  FormItemId,
  SetFormItemValuePayload,
  ShareDataSlice
} from '../shareData.slice'
import * as O from 'fp-ts/Option'
import { ResourceNotFoundError, ShowFileError, ResourceAlreadyExistsError } from '@/shared/error'
import { pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/Either'
import * as App from '../../../appStore'
import type { StoreApi } from 'zustand'

type Store = Readonly<{
  store: StoreApi<ShareDataSlice>
}>

type Data = {
  initialForm?: initFormPayload
  formItemPayload?: SetFormItemValuePayload
  id?: FormItemId
  expectedForm: Form
  expectedFormItem: FormItem
  resourceNotFoundError?: ResourceNotFoundError
  resourceAlreadyExistsError?: ResourceAlreadyExistsError
}

const initStore = (): Store => {
  const store = App.storeFactory()
  return { store }
}

describe('Considering the ShareDataSlice', () => {
  // Initial form payloads
  const initialForm1: initFormPayload = [
    {
      id: '1',
      type: 'text',
      label: 'title',
      value: ''
    }
  ]
  const initialForm2: initFormPayload = [
    {
      id: '2',
      type: 'select',
      label: 'tags',
      value: []
    }
  ]
  const initialForm3: initFormPayload = [
    {
      id: '3',
      type: 'numeric',
      label: 'fees',
      value: 0
    }
  ]
  const initialForm4: initFormPayload = [
    {
      id: '4',
      type: 'date',
      label: 'date',
      value: {}
    }
  ]
  const initialForm5: initFormPayload = [
    {
      id: '5',
      type: 'text',
      label: 'foo',
      value: ''
    },
    {
      id: '5',
      type: 'text',
      label: 'bar',
      value: ''
    }
  ]

  // Form Item payloads
  const formItemPayload1: SetFormItemValuePayload = { id: '1', value: 'foo' }
  const formItemPayload2: SetFormItemValuePayload = { id: '2', value: ['foo', 'bar'] }
  const formItemPayload3: SetFormItemValuePayload = { id: '3', value: 777 }
  const formItemPayload4: SetFormItemValuePayload = {
    id: '4',
    value: { from: '2023-02-01T00:00:00.000Z' }
  }
  const formItemPayload5: SetFormItemValuePayload = { id: '77', value: 'foo' }

  // Expected forms
  const expectedForm1: Form = [{ ...formItemPayload1, label: 'title', type: 'text' }]
  const expectedForm2: Form = [{ ...formItemPayload2, label: 'tags', type: 'select' }]
  const expectedForm3: Form = [{ ...formItemPayload3, label: 'fees', type: 'numeric' }]
  const expectedForm4: Form = [{ ...formItemPayload4, label: 'date', type: 'date' }]

  // Expected form items
  const expectedFormItem1: FormItem = initialForm1[0]
  const expectedUpdatedFormItem1: FormItem = { ...initialForm1[0], value: 'foo' }
  const expectedFormItem2: FormItem = { ...initialForm2[0], value: ['foo', 'bar'] }
  const expectedFormItem3: FormItem = { ...initialForm3[0], value: 777 }
  const expectedFormItem4: FormItem = {
    ...initialForm4[0],
    value: { from: '2023-02-01T00:00:00.000Z' }
  }

  describe.each`
    initialForm     | formItemPayload     | id           | expectedForm     | expectedFormItem                    | resourceNotFoundError                         | resourceAlreadyExistsError
    ${undefined}    | ${undefined}        | ${undefined} | ${[]}            | ${O.none}                           | ${undefined}                                  | ${undefined}
    ${initialForm1} | ${undefined}        | ${undefined} | ${initialForm1}  | ${O.none}                           | ${undefined}                                  | ${undefined}
    ${initialForm5} | ${undefined}        | ${undefined} | ${[]}            | ${O.none}                           | ${undefined}                                  | ${ResourceAlreadyExistsError(['5', '5'])}
    ${initialForm1} | ${undefined}        | ${'1'}       | ${initialForm1}  | ${O.some(expectedFormItem1)}        | ${undefined}                                  | ${undefined}
    ${initialForm1} | ${formItemPayload1} | ${'1'}       | ${expectedForm1} | ${O.some(expectedUpdatedFormItem1)} | ${undefined}                                  | ${undefined}
    ${initialForm2} | ${formItemPayload2} | ${undefined} | ${expectedForm2} | ${O.none}                           | ${undefined}                                  | ${undefined}
    ${initialForm2} | ${formItemPayload2} | ${'2'}       | ${expectedForm2} | ${O.some(expectedFormItem2)}        | ${undefined}                                  | ${undefined}
    ${initialForm3} | ${formItemPayload3} | ${undefined} | ${expectedForm3} | ${O.none}                           | ${undefined}                                  | ${undefined}
    ${initialForm3} | ${formItemPayload3} | ${'3'}       | ${expectedForm3} | ${O.some(expectedFormItem3)}        | ${undefined}                                  | ${undefined}
    ${initialForm4} | ${formItemPayload4} | ${'4'}       | ${expectedForm4} | ${O.some(expectedFormItem4)}        | ${undefined}                                  | ${undefined}
    ${initialForm1} | ${formItemPayload5} | ${undefined} | ${initialForm1}  | ${O.none}                           | ${ResourceNotFoundError(formItemPayload5.id)} | ${undefined}
  `(
    `Given an initial form <$initialForm> and a form item payload <$formItemPayload>`,
    ({
      initialForm,
      formItemPayload,
      id,
      expectedForm,
      expectedFormItem,
      resourceNotFoundError,
      resourceAlreadyExistsError
    }: Data) => {
      describe('When setting formItem value after intialization', () => {
        const { store } = initStore()

        test(`Then expect form to be ${JSON.stringify(
          expectedForm
        )} and selected formItem to be ${JSON.stringify(expectedFormItem)}`, async () => {
          if (initialForm) {
            const result = store.getState().shareData.initForm(initialForm)()
            expect(result).toBeEither()

            if (resourceAlreadyExistsError) {
              expect(result).toBeLeft()
              expect(result).toEqualLeft(resourceAlreadyExistsError)

              const message = pipe(result, E.getOrElseW(ShowFileError.show))
              expect(message).toStrictEqual(
                `Error ${
                  resourceAlreadyExistsError._tag
                }: Failed to store resource with conflicting IDs [${resourceAlreadyExistsError.resourceIds.join(
                  ', '
                )}].`
              )
            } else {
              expect(result).toBeRight()
            }
          }
          if (formItemPayload) {
            const result = store.getState().shareData.setFormItemValue(formItemPayload)()
            expect(result).toBeEither()

            if (resourceNotFoundError) {
              expect(result).toBeLeft()
              expect(result).toEqualLeft(resourceNotFoundError)

              const message = pipe(result, E.getOrElseW(ShowFileError.show))
              expect(message).toStrictEqual(
                `Error ${resourceNotFoundError._tag}: Failed to handle resource with ID '${resourceNotFoundError.resourceId}' since it does not exist.`
              )
            } else {
              expect(result).toBeRight()
            }
          }

          if (id) {
            const formItem = store.getState().shareData.formItemById(id)()
            expect(formItem).toBeOption()
            expect(formItem).toStrictEqual(expectedFormItem)
          }

          expect(store.getState().shareData.form).toStrictEqual(expectedForm)
        })
      })
    }
  )
})
