/* eslint-disable max-lines-per-function */
import { flow, pipe } from 'fp-ts/lib/function'
import { contramap as eqContramap } from 'fp-ts/Eq'
import { ResourceAlreadyExistsError, ResourceNotFoundError } from '@/shared/error/resource'
import { PayloadIsEmptyError } from '@/shared/error/payload'
import type { StateCreator } from 'zustand'
import type { IOEither } from 'fp-ts/IOEither'
import type { IOOption } from 'fp-ts/IOOption'
import type { Eq } from 'fp-ts/lib/Eq'
import type { Show } from 'fp-ts/lib/Show'
import type IO from 'fp-ts/IO'
import * as A from 'fp-ts/Array'
import * as IOE from 'fp-ts/IOEither'
import * as IOO from 'fp-ts/IOOption'
import * as S from 'fp-ts/string'
import * as B from 'fp-ts/boolean'
import * as E from 'fp-ts/Either'
import * as N from 'fp-ts/number'
import * as O from 'fp-ts/Option'
import * as P from 'fp-ts/Predicate'

export type I18nString = {
  language: string
  value: string
}

export type I18nTextFieldValue = I18nString[]

export type FormItemId = string
export type FormItemBaseProperties = Readonly<{
  id: FormItemId
  title: string
  required?: boolean
}>

export type I18NTextField = FormItemBaseProperties & {
  type: 'i18n-text'
  value: O.Option<I18nTextFieldValue>
}

export type TextField = FormItemBaseProperties & {
  type: 'text'
  value: O.Option<string>
}

export type NumericField = FormItemBaseProperties & {
  type: 'numeric'
  value: O.Option<number>
}

export type TagField = FormItemBaseProperties & {
  type: 'tag'
  value: O.Option<string[]>
}

export type SelectPicker = FormItemBaseProperties & {
  type: 'select'
  value: O.Option<string[]>
}

export type FormItem = I18NTextField | TextField | NumericField | TagField | SelectPicker

export type Form = FormItem[]

export type InitFormItem = FormItem
export type InitFormPayload = InitFormItem[]

export type StorageServiceId = string

export type I18nStringPayload = {
  language: string
  value: string
}

export type SetFormItemValuePayload = {
  id: FormItemId
  value: string | number | I18nStringPayload
}

export const FormItemWrongTypeError = (formItemId: string, type: unknown) =>
  ({
    _tag: 'form-item-wrong-type',
    formItemId,
    type
  } as const)

export type FormItemWrongTypeError = ReturnType<typeof FormItemWrongTypeError>

export type FormError = FormItemWrongTypeError

export const ShowFormError: Show<FormError> = {
  show: (error: FormError): string => {
    switch (error._tag) {
      case 'form-item-wrong-type': {
        return `Error ${error._tag}: Failed to handle form item with id ${error.formItemId} because its type: '${error.type}' is the wrong one.`
      }
    }
  }
}

export type ShareDataSlice = {
  shareData: {
    form: Form
    storageServiceId: O.Option<StorageServiceId>
    initForm: (
      payload: InitFormPayload
    ) => IOEither<PayloadIsEmptyError | ResourceAlreadyExistsError, void>
    formItemById: (id: FormItemId) => IOOption<FormItem>
    isFormInitialized: () => IO.IO<boolean>
    setStorageServiceId: (id: O.Option<StorageServiceId>) => IOE.IOEither<PayloadIsEmptyError, void>
    setFormItemValue: (
      id: string,
      value: string | number | I18nStringPayload
    ) => IOEither<ResourceNotFoundError | PayloadIsEmptyError | FormItemWrongTypeError, void>
  }
}
const eqFormItemId: Eq<FormItemId> = S.Eq
const eqFormItem: Eq<{ id: string }> = pipe(
  eqFormItemId,
  eqContramap(it => it.id)
)

const isNotEmptyPredicate = (text: string): boolean => !S.isEmpty(text)

const resourceNotFoundError = (resourceId: FormItemId): ResourceNotFoundError =>
  ResourceNotFoundError(resourceId)

const resourceAlreadyExistsError = (resourceIds: FormItemId[]): ResourceAlreadyExistsError =>
  ResourceAlreadyExistsError(resourceIds)

const emptyPayloadError = (): PayloadIsEmptyError => PayloadIsEmptyError()

const wrongValueError = (formItemId: string, type: unknown): FormItemWrongTypeError =>
  FormItemWrongTypeError(formItemId, type)

const isInitFormPayloadUniq = (payload: InitFormPayload): boolean =>
  N.Eq.equals(A.uniq(eqFormItem)(payload).length, payload.length)

const isInitFormIdUniq =
  (payload: InitFormPayload) =>
  (state: Form): boolean =>
    !A.some((formItem: FormItem) =>
      A.some((initFormItem: InitFormItem) => initFormItem.id === formItem.id)(payload)
    )(state)

const retrieveFormItem =
  (state: Form) =>
  (formItemId: FormItemId): O.Option<FormItem> =>
    A.findFirst((formItem: FormItem) => formItem.id === formItemId)(state)

const setFormItemValueInvariant =
  (formItemId: FormItemId) =>
  (state: Form): E.Either<ResourceNotFoundError, FormItem> =>
    pipe(
      formItemId,
      retrieveFormItem(state),
      E.fromOption(() => resourceNotFoundError(formItemId))
    )

const removeElement = (elements: string[], value: string): string[] =>
  elements.filter(elt => elt !== value)

const mapToI18NTextField = (
  i18nUpdatedText: I18nStringPayload,
  storedI18nTexts: I18NTextField['value']
): I18NTextField['value'] => {
  const isSameLanguagePredicate = (i18nText: I18nString): boolean =>
    S.Eq.equals(i18nText.language, i18nUpdatedText.language)

  const updateTranslationText = (textValues: I18nTextFieldValue): I18nTextFieldValue =>
    pipe(
      textValues,
      A.map(i18n =>
        isSameLanguagePredicate(i18n) ? { ...i18n, value: i18nUpdatedText.value } : i18n
      )
    )

  const removeTranslationText = (textValues: I18nTextFieldValue): I18nTextFieldValue =>
    pipe(textValues, A.filter(P.not(isSameLanguagePredicate)))

  return pipe(
    storedI18nTexts,
    O.fold(
      () => O.some([i18nUpdatedText]),
      textValues =>
        pipe(
          textValues,
          A.findFirst(isSameLanguagePredicate),
          O.match(
            () => O.some([...textValues, i18nUpdatedText]),
            () =>
              O.some(
                pipe(
                  S.isEmpty(i18nUpdatedText.value),
                  B.match(
                    () => updateTranslationText(textValues),
                    () => removeTranslationText(textValues)
                  )
                )
              )
          )
        )
    )
  )
}

const mapToTextFieldValue = (value: string): TextField['value'] =>
  pipe(value, O.fromPredicate(P.not(S.isEmpty)))

const mapToNumericFieldValue = (value: number): NumericField['value'] =>
  pipe(value, O.fromPredicate(N.isNumber))

const updateValues = (values: string[], value: string): O.Option<string[]> =>
  pipe(
    values.includes(value),
    B.match(
      () => O.some([...values, value]),
      () => O.some(removeElement(values, value))
    )
  )
const mapToTagFieldValue = (
  tagValue: string,
  storedValues: TagField['value']
): TagField['value'] => {
  return pipe(
    storedValues,
    O.fold(
      () => O.some([tagValue]),
      tags => updateValues(tags, tagValue)
    )
  )
}

const mapToSelectFieldValue = (
  value: string,
  storedValues: SelectPicker['value']
): SelectPicker['value'] => {
  return pipe(
    storedValues,
    O.fold(
      () => O.some([value]),
      options => updateValues(options, value)
    )
  )
}

const isI18nStringPredicate = (
  formItemValue: number | string | I18nStringPayload
): formItemValue is I18nStringPayload =>
  typeof formItemValue !== 'string' &&
  typeof formItemValue !== 'number' &&
  'language' in formItemValue

const updateFormItem =
  (updatedValue: number | string | I18nStringPayload) =>
  (formItem: FormItem): E.Either<FormItemWrongTypeError, FormItem> => {
    switch (formItem.type) {
      case 'i18n-text': {
        return pipe(
          updatedValue,
          E.fromPredicate(isI18nStringPredicate, () => wrongValueError(formItem.id, formItem.type)),
          E.map(i18nValue => ({
            ...formItem,
            value: mapToI18NTextField(i18nValue, formItem.value)
          }))
        )
      }

      case 'text': {
        return pipe(
          updatedValue,
          E.fromPredicate(S.isString, () => wrongValueError(formItem.id, formItem.type)),
          E.map(textValue => ({
            ...formItem,
            value: mapToTextFieldValue(textValue)
          }))
        )
      }

      case 'numeric': {
        return pipe(
          updatedValue,
          E.fromPredicate(N.isNumber, () => wrongValueError(formItem.id, formItem.type)),
          E.map(numericValue => ({
            ...formItem,
            value: mapToNumericFieldValue(numericValue)
          }))
        )
      }

      case 'tag': {
        return pipe(
          updatedValue,
          E.fromPredicate(S.isString, () => wrongValueError(formItem.id, formItem.type)),
          E.map(tagValue => ({
            ...formItem,
            value: mapToTagFieldValue(tagValue, formItem.value)
          }))
        )
      }

      case 'select': {
        return pipe(
          updatedValue,
          E.fromPredicate(S.isString, () => wrongValueError(formItem.id, formItem.type)),
          E.map(selectValue => ({
            ...formItem,
            value: mapToSelectFieldValue(selectValue, formItem.value)
          }))
        )
      }
    }
  }

const mapFormIds = (form: Form): FormItemId[] => A.map((formItem: FormItem) => formItem.id)(form)

const initFormInvariant =
  (initForm: InitFormPayload) =>
  (state: Form): E.Either<ResourceAlreadyExistsError, InitFormPayload> =>
    pipe(
      initForm,
      E.fromPredicate(flow(isInitFormIdUniq(state)), flow(mapFormIds, resourceAlreadyExistsError)),
      E.flatMap(
        flow(E.fromPredicate(isInitFormPayloadUniq, flow(mapFormIds, resourceAlreadyExistsError)))
      )
    )

export type ShareDataState = {
  data: {
    form: Form
    storageServiceId: O.Option<StorageServiceId>
  }
}

export type ShareDataOptions = {
  initialState: ShareDataState
}

type ShareDataStateCreator = ({
  initialState
}?: Partial<ShareDataOptions>) => StateCreator<ShareDataSlice, [], [], ShareDataSlice>

export const createShareDataSlice: ShareDataStateCreator =
  ({ initialState } = {}) =>
  (set, get) => ({
    shareData: {
      form: pipe(
        initialState,
        O.fromNullable,
        O.map(it => it.data.form),
        O.getOrElse<Form>(() => [])
      ),
      storageServiceId: pipe(
        initialState,
        O.fromNullable,
        O.map(it => it.data.storageServiceId),
        O.getOrElse<O.Option<StorageServiceId>>(() => O.none)
      ),
      initForm: (payload: InitFormPayload) =>
        pipe(
          payload,
          A.isEmpty,
          B.matchW(
            () =>
              pipe(
                IOE.fromIO(() => get().shareData.form),
                IOE.flatMap(
                  flow(
                    initFormInvariant(payload),
                    IOE.fromEither,
                    IOE.chainIOK(
                      form => () =>
                        set(state => ({
                          shareData: {
                            ...state.shareData,
                            form
                          }
                        }))
                    )
                  )
                )
              ),
            () => IOE.left(emptyPayloadError())
          )
        ),
      formItemById: (id: FormItemId) =>
        pipe(
          IOO.fromIO(() => get().shareData.form),
          IOO.chainOptionK(flow(A.findFirst(formItem => eqFormItem.equals(formItem, { id }))))
        ),
      setFormItemValue: (id: string, value: number | string | I18nStringPayload) =>
        pipe(
          id,
          S.isEmpty,
          B.matchW(
            () =>
              pipe(
                IOE.fromIO(() => get().shareData.form),
                IOE.flatMap(
                  flow(
                    setFormItemValueInvariant(id),
                    IOE.fromEither,
                    IOE.chainW(
                      flow(
                        updateFormItem(value),
                        IOE.fromEither,
                        IOE.chainIOK(
                          formItem => () =>
                            set(state => ({
                              shareData: {
                                ...state.shareData,
                                form: pipe(
                                  state.shareData.form,
                                  A.map(it => (S.Eq.equals(it.id, id) ? formItem : it))
                                )
                              }
                            }))
                        )
                      )
                    )
                  )
                )
              ),
            () => IOE.left(emptyPayloadError())
          )
        ),
      isFormInitialized: () => () => get().shareData.form.length > 0,
      setStorageServiceId: (id: O.Option<StorageServiceId>) =>
        pipe(
          id,
          O.match(
            () =>
              IOE.rightIO(() =>
                set(state => ({ shareData: { ...state.shareData, storageServiceId: O.none } }))
              ),
            flow(
              IOE.fromPredicate(isNotEmptyPredicate, emptyPayloadError),
              IOE.chainIOK(
                () => () =>
                  set(state => ({ shareData: { ...state.shareData, storageServiceId: id } }))
              )
            )
          )
        )
    }
  })
