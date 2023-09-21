/* eslint-disable max-lines-per-function */
import { PayloadIsEmptyError, ShowPayloadError } from '@/shared/error/payload'
import {
  ResourceAlreadyExistsError,
  ResourceNotFoundError,
  ShowResourceError
} from '@/shared/error/resource'
import type {
  Form,
  FormItem,
  I18nString,
  InitFormPayload,
  SetFormItemValuePayload,
  ShareDataSlice,
  StorageServiceId
} from '../shareData.slice'

import { FormItemWrongTypeError, ShowFormError } from '../shareData.slice'
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

type Data3 = {
  preloadedState?: AppOptions
  form: Form
  formItemPayload: SetFormItemValuePayload
  expectedForm: Form
  expectedFormItem: FormItem
  expectedIsEmptyPayloadError?: PayloadIsEmptyError
  expectedAlreadyExistsError?: ResourceAlreadyExistsError
  expectedNotFoundError?: ResourceNotFoundError
  expectedWrongTypeError?: FormItemWrongTypeError
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
  // existant form items
  const numericItemID1: FormItem = {
    id: '1',
    title: 'fee',
    required: true,
    type: 'numeric',
    value: O.some(3)
  }

  const textItemID2: FormItem = {
    id: '2',
    title: 'author',
    required: false,
    type: 'text',
    value: O.some('okp4')
  }

  const emptyI18nTextItemID3: FormItem = {
    id: '3',
    title: 'description',
    required: false,
    type: 'i18n-text',
    value: O.none
  }

  const i18nTextItemID3: FormItem = {
    id: '3',
    title: 'description',
    required: false,
    type: 'i18n-text',
    value: O.some([
      { language: 'en', value: 'Some text' },
      { language: 'fr', value: 'Du texte' }
    ])
  }

  const emptySelectItemID4: FormItem = {
    id: '4',
    title: 'country',
    required: false,
    type: 'select',
    value: O.none
  }

  const selectItemID4: FormItem = {
    id: '4',
    title: 'country',
    required: false,
    type: 'select',
    value: O.some(['sp', 'in'])
  }

  const tagItemID5: FormItem = {
    id: '5',
    title: 'tags',
    required: false,
    type: 'tag',
    value: O.some(['Agriculture', 'Open Data', 'Dataviz'])
  }

  const dateStringRangeItemID6: FormItem = {
    id: '6',
    title: 'date range',
    required: false,
    type: 'date-range',
    value: O.some({ from: '2023-09-21', to: '2023-09-30' })
  }

  const emptyDateStringRangeItemID6: FormItem = {
    id: '6',
    title: 'date range',
    required: false,
    type: 'date-range',
    value: O.some({ from: null, to: null })
  }

  const fromDateStringRangeItemID6: FormItem = {
    id: '6',
    title: 'date range',
    required: false,
    type: 'date-range',
    value: O.some({ from: '2023-09-21', to: null })
  }

  // init form payloads
  const initialFormPayload1: InitFormPayload = [textItemID2]

  const initialFormWithSameFormItemsIdsPayload: InitFormPayload = [
    textItemID2,
    { id: '2', title: 'author', required: true, type: 'text', value: O.none }
  ]

  // form items payload
  const numericFormItemPayloadID1: SetFormItemValuePayload = {
    id: '1',
    value: 6
  }

  const numericFormItemPayloadID1WithZeroValue: SetFormItemValuePayload = {
    id: '1',
    value: 0
  }

  const numericFormItemPayloadID20: SetFormItemValuePayload = {
    id: '20',
    value: 6
  }

  const textFormItemPayloadID2: SetFormItemValuePayload = {
    id: '2',
    value: 'new text entered'
  }

  const i18nTextFormItemPayloadWithUpdatedTextID3: SetFormItemValuePayload = {
    id: '3',
    value: { language: 'en', value: 'Some new updated text' }
  }

  const i18nTextFormItemPayloadWithNewLanguageID3: SetFormItemValuePayload = {
    id: '3',
    value: { language: 'it', value: 'del nuovo testo' }
  }

  const i18nTextFormItemPayloadWithEmptyStringOnLanguageID3: SetFormItemValuePayload = {
    id: '3',
    value: { language: 'fr', value: '' }
  }

  const addSelectedFormItemPayloadID4: SetFormItemValuePayload = {
    id: '4',
    value: 'de'
  }

  const removeSelectedFromSelectFormItemPayloadID4: SetFormItemValuePayload = {
    id: '4',
    value: 'sp'
  }

  const addTagFormItemPayloadID5: SetFormItemValuePayload = {
    id: '5',
    value: 'RPG'
  }

  const removeTagFormItemPayloadID5: SetFormItemValuePayload = {
    id: '5',
    value: 'Open Data'
  }

  const numericFormItemPayloadID5: SetFormItemValuePayload = {
    id: '5',
    value: 6
  }

  const dateStringRangeFormItemPayloadID6: SetFormItemValuePayload = {
    id: '6',
    value: { from: '2023-09-21', to: '2023-09-30' }
  }

  const emptyDateStringRangeFormItemPayloadID6: SetFormItemValuePayload = {
    id: '6',
    value: { from: null, to: null }
  }

  const fromDateStringRangeFormItemPayloadID6: SetFormItemValuePayload = {
    id: '6',
    value: { from: '2023-09-21', to: null }
  }

  // preloaded states
  const preloadedStateWithServicestorageId1: AppOptions = {
    initialState: {
      shareData: {
        initialState: {
          data: { form: [], storageServiceId: O.some('1') }
        }
      }
    }
  }

  const preloadedStateWithFormItem = (formItem: FormItem): AppOptions => ({
    initialState: {
      shareData: {
        initialState: {
          data: { form: [formItem], storageServiceId: O.none }
        }
      }
    }
  })

  // expected formItem
  const expectedNumericFormItem1: FormItem = {
    id: '1',
    title: 'fee',
    required: true,
    type: 'numeric',
    value: O.some(6)
  }

  const expectedNumericFormItem1WithZeroValue: FormItem = {
    id: '1',
    title: 'fee',
    required: true,
    type: 'numeric',
    value: O.some(0)
  }

  const expectedTextFormItem2: FormItem = {
    ...textItemID2,
    value: O.some(textFormItemPayloadID2.value as string)
  }

  const expectedI18nTextWithUpdatedTextFormItem3: FormItem = {
    ...i18nTextItemID3,
    value: O.some([
      i18nTextFormItemPayloadWithUpdatedTextID3.value as I18nString,
      { language: 'fr', value: 'Du texte' }
    ])
  }

  const expectedI18nTextWithNewLanguageFormItem3: FormItem = {
    ...i18nTextItemID3,
    value: O.some([
      { language: 'en', value: 'Some text' },
      { language: 'fr', value: 'Du texte' },
      i18nTextFormItemPayloadWithNewLanguageID3.value as I18nString
    ])
  }

  const expectedI18nTextWithEMptyStringOnLanguageFormItem3: FormItem = {
    ...i18nTextItemID3,
    value: O.some([{ language: 'en', value: 'Some text' }])
  }

  const expectedI18nTextWithOneLanguageFormItem3: FormItem = {
    ...i18nTextItemID3,
    value: O.some([{ language: 'it', value: 'del nuovo testo' }])
  }

  const expectedSelectWithOneSelectionFormItem4: FormItem = {
    ...selectItemID4,
    value: O.some(['de'])
  }

  const expectedSelectWithUpdatedSelectionFormItem4: FormItem = {
    ...selectItemID4,
    value: O.some(['sp', 'in', 'de'])
  }

  const expectedSelectWithRemovedSelectionFormItem4: FormItem = {
    ...selectItemID4,
    value: O.some(['in'])
  }

  const expectedTagsWithAdditionalTagFormItem5: FormItem = {
    ...tagItemID5,
    value: O.some(['Agriculture', 'Open Data', 'Dataviz', 'RPG'])
  }

  const expectedTagsWithoutRemovedTagFormItem5: FormItem = {
    ...tagItemID5,
    value: O.some(['Agriculture', 'Dataviz'])
  }

  const expectedDateStringRangeFormItem6: FormItem = {
    ...dateStringRangeItemID6,
    value: O.some({ from: '2023-09-21', to: '2023-09-30' })
  }

  const expectedEmptyDateStringRangeFormItem6: FormItem = {
    ...emptyDateStringRangeItemID6,
    value: O.some({ from: null, to: null })
  }

  const expectedFromDateStringRangeFormItem6: FormItem = {
    ...fromDateStringRangeItemID6,
    value: O.some({ from: '2023-09-21', to: null })
  }

  describe.each`
    preloadedState                                | initialFormPayload                        | expectedForm        | expectIsFormInitialized | expectedIsEmptyPayloadError | expectedAlreadyExistsError
    ${[]}                                         | ${[]}                                     | ${[]}               | ${false}                | ${PayloadIsEmptyError()}    | ${undefined}
    ${[]}                                         | ${initialFormWithSameFormItemsIdsPayload} | ${[]}               | ${false}                | ${undefined}                | ${ResourceAlreadyExistsError(['2', '2'])}
    ${[]}                                         | ${initialFormPayload1}                    | ${[textItemID2]}    | ${true}                 | ${undefined}                | ${undefined}
    ${preloadedStateWithFormItem(numericItemID1)} | ${[numericItemID1]}                       | ${[numericItemID1]} | ${true}                 | ${undefined}                | ${ResourceAlreadyExistsError(['1'])}
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
            expect(result).toBeEither()

            const { form, isFormInitialized } = store.getState().shareData

            if (expectedIsEmptyPayloadError) {
              expect(result).toStrictEqualLeft(expectedIsEmptyPayloadError)
              const message = pipe(
                result as E.Either<PayloadIsEmptyError, void>,
                E.getOrElseW(ShowPayloadError.show)
              )
              expect(message).toStrictEqual(
                `Error ${expectedIsEmptyPayloadError._tag}: Failed to execute command with an empty payload.`
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
    ${undefined}                           | ${O.some('')}           | ${O.none}                | ${PayloadIsEmptyError()}
    ${preloadedStateWithServicestorageId1} | ${O.some('2')}          | ${O.some('2')}           | ${undefined}
    ${preloadedStateWithServicestorageId1} | ${O.some('')}           | ${O.some('1')}           | ${PayloadIsEmptyError()}
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
          expect(setStorageIdResult).toBeEither()

          if (expectedIsEmptyPayloadError) {
            expect(setStorageIdResult).toStrictEqualLeft(expectedIsEmptyPayloadError)
            const message = pipe(
              setStorageIdResult as E.Either<PayloadIsEmptyError, void>,
              E.getOrElseW(ShowPayloadError.show)
            )
            expect(message).toStrictEqual(
              `Error ${expectedIsEmptyPayloadError._tag}: Failed to execute command with an empty payload.`
            )
          } else {
            expect(setStorageIdResult).toBeRight()
          }
          expect(serviceStorageId).toStrictEqual(expectedServiceStorageId)
        })
      })
    }
  )

  describe.each`
    preloadedState                                             | formItemPayload                                        | expectedForm                                            | expectedFormItem                                              | expectedIsEmptyPayloadError | expectedNotFoundError                                   | expectedWrongTypeError
    ${undefined}                                               | ${numericFormItemPayloadID1}                           | ${[]}                                                   | ${O.none}                                                     | ${undefined}                | ${ResourceNotFoundError(numericFormItemPayloadID1.id)}  | ${undefined}
    ${preloadedStateWithFormItem(numericItemID1)}              | ${numericFormItemPayloadID1WithZeroValue}              | ${[expectedNumericFormItem1WithZeroValue]}              | ${O.some(expectedNumericFormItem1WithZeroValue)}              | ${undefined}                | ${undefined}                                            | ${undefined}
    ${preloadedStateWithFormItem(numericItemID1)}              | ${numericFormItemPayloadID1}                           | ${[expectedNumericFormItem1]}                           | ${O.some(expectedNumericFormItem1)}                           | ${undefined}                | ${undefined}                                            | ${undefined}
    ${preloadedStateWithFormItem(numericItemID1)}              | ${{ id: '', value: 10 }}                               | ${[numericItemID1]}                                     | ${O.none}                                                     | ${PayloadIsEmptyError()}    | ${undefined}                                            | ${undefined}
    ${preloadedStateWithFormItem(numericItemID1)}              | ${numericFormItemPayloadID20}                          | ${[numericItemID1]}                                     | ${O.none}                                                     | ${undefined}                | ${ResourceNotFoundError(numericFormItemPayloadID20.id)} | ${undefined}
    ${preloadedStateWithFormItem(textItemID2)}                 | ${textFormItemPayloadID2}                              | ${[expectedTextFormItem2]}                              | ${O.some(expectedTextFormItem2)}                              | ${undefined}                | ${undefined}                                            | ${undefined}
    ${preloadedStateWithFormItem(emptyI18nTextItemID3)}        | ${i18nTextFormItemPayloadWithNewLanguageID3}           | ${[expectedI18nTextWithOneLanguageFormItem3]}           | ${O.some(expectedI18nTextWithOneLanguageFormItem3)}           | ${undefined}                | ${undefined}                                            | ${undefined}
    ${preloadedStateWithFormItem(i18nTextItemID3)}             | ${i18nTextFormItemPayloadWithUpdatedTextID3}           | ${[expectedI18nTextWithUpdatedTextFormItem3]}           | ${O.some(expectedI18nTextWithUpdatedTextFormItem3)}           | ${undefined}                | ${undefined}                                            | ${undefined}
    ${preloadedStateWithFormItem(i18nTextItemID3)}             | ${i18nTextFormItemPayloadWithNewLanguageID3}           | ${[expectedI18nTextWithNewLanguageFormItem3]}           | ${O.some(expectedI18nTextWithNewLanguageFormItem3)}           | ${undefined}                | ${undefined}                                            | ${undefined}
    ${preloadedStateWithFormItem(i18nTextItemID3)}             | ${i18nTextFormItemPayloadWithEmptyStringOnLanguageID3} | ${[expectedI18nTextWithEMptyStringOnLanguageFormItem3]} | ${O.some(expectedI18nTextWithEMptyStringOnLanguageFormItem3)} | ${undefined}                | ${undefined}                                            | ${undefined}
    ${preloadedStateWithFormItem(emptySelectItemID4)}          | ${addSelectedFormItemPayloadID4}                       | ${[expectedSelectWithOneSelectionFormItem4]}            | ${O.some(expectedSelectWithOneSelectionFormItem4)}            | ${undefined}                | ${undefined}                                            | ${undefined}
    ${preloadedStateWithFormItem(selectItemID4)}               | ${addSelectedFormItemPayloadID4}                       | ${[expectedSelectWithUpdatedSelectionFormItem4]}        | ${O.some(expectedSelectWithUpdatedSelectionFormItem4)}        | ${undefined}                | ${undefined}                                            | ${undefined}
    ${preloadedStateWithFormItem(selectItemID4)}               | ${removeSelectedFromSelectFormItemPayloadID4}          | ${[expectedSelectWithRemovedSelectionFormItem4]}        | ${O.some(expectedSelectWithRemovedSelectionFormItem4)}        | ${undefined}                | ${undefined}                                            | ${undefined}
    ${preloadedStateWithFormItem(tagItemID5)}                  | ${addTagFormItemPayloadID5}                            | ${[expectedTagsWithAdditionalTagFormItem5]}             | ${O.some(expectedTagsWithAdditionalTagFormItem5)}             | ${undefined}                | ${undefined}                                            | ${undefined}
    ${preloadedStateWithFormItem(tagItemID5)}                  | ${removeTagFormItemPayloadID5}                         | ${[expectedTagsWithoutRemovedTagFormItem5]}             | ${O.some(expectedTagsWithoutRemovedTagFormItem5)}             | ${undefined}                | ${undefined}                                            | ${undefined}
    ${preloadedStateWithFormItem(tagItemID5)}                  | ${numericFormItemPayloadID5}                           | ${[tagItemID5]}                                         | ${O.some(tagItemID5)}                                         | ${undefined}                | ${undefined}                                            | ${FormItemWrongTypeError(tagItemID5.id, tagItemID5.type)}
    ${preloadedStateWithFormItem(dateStringRangeItemID6)}      | ${dateStringRangeFormItemPayloadID6}                   | ${[expectedDateStringRangeFormItem6]}                   | ${O.some(expectedDateStringRangeFormItem6)}                   | ${undefined}                | ${undefined}                                            | ${undefined}
    ${preloadedStateWithFormItem(emptyDateStringRangeItemID6)} | ${emptyDateStringRangeFormItemPayloadID6}              | ${[expectedEmptyDateStringRangeFormItem6]}              | ${O.some(expectedEmptyDateStringRangeFormItem6)}              | ${undefined}                | ${undefined}                                            | ${undefined}
    ${preloadedStateWithFormItem(fromDateStringRangeItemID6)}  | ${fromDateStringRangeFormItemPayloadID6}               | ${[expectedFromDateStringRangeFormItem6]}               | ${O.some(expectedFromDateStringRangeFormItem6)}               | ${undefined}                | ${undefined}                                            | ${undefined}
  `(
    'Given a form item payload <$formItemPayload> ',
    ({
      preloadedState,
      formItemPayload,
      expectedForm,
      expectedFormItem,
      expectedNotFoundError,
      expectedIsEmptyPayloadError,
      expectedWrongTypeError
    }: Data3) => {
      describe('When calling set form item method with this payload', () => {
        const { store } = initStore(preloadedState)
        const setFormItemValueResult = store
          .getState()
          .shareData.setFormItemValue(formItemPayload.id, formItemPayload.value)()
        const retrievedForm = store.getState().shareData.form
        const retrievedFormitem = store.getState().shareData.formItemById(formItemPayload.id)()

        test(`Then, we expect form item to be  ${JSON.stringify(expectedFormItem)}`, () => {
          expect(setFormItemValueResult).toBeEither()

          if (expectedNotFoundError) {
            const message = pipe(
              setFormItemValueResult as E.Either<ResourceNotFoundError, void>,
              E.getOrElseW(ShowResourceError.show)
            )

            expect(message).toStrictEqual(
              `Error ${expectedNotFoundError._tag}: Failed to handle resource with ID '${expectedNotFoundError.resourceId}' since it does not exist.`
            )
          }
          if (expectedIsEmptyPayloadError) {
            const message = pipe(
              setFormItemValueResult as E.Either<PayloadIsEmptyError, void>,
              E.getOrElseW(ShowPayloadError.show)
            )
            expect(message).toStrictEqual(
              `Error ${expectedIsEmptyPayloadError._tag}: Failed to execute command with an empty payload.`
            )
          }

          if (expectedWrongTypeError) {
            const message = pipe(
              setFormItemValueResult as E.Either<FormItemWrongTypeError, void>,
              E.getOrElseW(ShowFormError.show)
            )

            expect(message).toStrictEqual(
              `Error ${expectedWrongTypeError._tag}: Failed to handle form item with id ${expectedWrongTypeError.formItemId} because its type: '${expectedWrongTypeError.value}' is the wrong one.`
            )
          }
          expect(retrievedForm).toStrictEqual(expectedForm)
          expect(retrievedFormitem).toBeOption()
          expect(retrievedFormitem).toStrictEqual(expectedFormItem)
        })
      })
    }
  )
})
