/* eslint-disable max-lines-per-function */
import { flow, pipe } from 'fp-ts/lib/function'
import { contramap as eqContramap } from 'fp-ts/Eq'
import { ResourceAlreadyExistsError, ResourceNotFoundError } from '@/shared/error/resource'
import type { StateCreator } from 'zustand'
import type { IOEither } from 'fp-ts/IOEither'
import type { IOOption } from 'fp-ts/IOOption'
import type { Eq } from 'fp-ts/lib/Eq'
import type IO from 'fp-ts/IO'
import * as A from 'fp-ts/Array'
import * as IOE from 'fp-ts/IOEither'
import * as IOO from 'fp-ts/IOOption'
import * as S from 'fp-ts/string'
import * as B from 'fp-ts/boolean'
import * as E from 'fp-ts/Either'
import * as N from 'fp-ts/number'
import * as O from 'fp-ts/Option'

export type I18nString = {
  language: string
  value: string
}

export type SelectPickerValue = {
  label: I18nString[]
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
  value: O.Option<SelectPickerValue[]>
}

export type FormItem = I18NTextField | TextField | NumericField | TagField | SelectPicker

export type Form = FormItem[]

export type initFormItem = FormItem
export type initFormPayload = initFormItem[]

export type storageServiceId = string

export type ShareDataSlice = {
  shareData: {
    form: Form
    storageServiceId: O.Option<storageServiceId>
    initForm: (payload: initFormPayload) => IOEither<ResourceAlreadyExistsError, void>
    formItemById: (id: FormItemId) => IOOption<FormItem>
    isFormInitialized: () => IO.IO<boolean>
    setStorageServiceId: (id: O.Option<storageServiceId>) => IO.IO<void>
  }
}

const eqFormItemId: Eq<FormItemId> = S.Eq
const eqFormItem: Eq<{ id: string }> = pipe(
  eqFormItemId,
  eqContramap(it => it.id)
)

const resourceNotFoundError = (resourceId: FormItemId): ResourceNotFoundError =>
  ResourceNotFoundError(resourceId)
const resourceAlreadyExistsError = (resourceIds: FormItemId[]): ResourceAlreadyExistsError =>
  ResourceAlreadyExistsError(resourceIds)

const isInitFormPayloadUniq = (payload: initFormPayload): boolean =>
  N.Eq.equals(A.uniq(eqFormItem)(payload).length, payload.length)

const isInitFormIdUniq =
  (payload: initFormPayload) =>
  (state: Form): boolean =>
    !A.some((formItem: FormItem) =>
      A.some((initFormItem: initFormItem) => initFormItem.id === formItem.id)(payload)
    )(state)

const formIdExists =
  (state: Form) =>
  (formItemId: FormItemId): boolean =>
    A.some((formItem: FormItem) => formItem.id === formItemId)(state)

const setFormItemValueInvariant =
  (formItemId: FormItemId) =>
  (state: Form): E.Either<ResourceNotFoundError, FormItemId> =>
    pipe(formItemId, E.fromPredicate(flow(formIdExists(state)), resourceNotFoundError))

const mapFormIds = (form: Form): FormItemId[] => A.map((formItem: FormItem) => formItem.id)(form)

const initFormInvariant =
  (initForm: initFormPayload) =>
  (state: Form): E.Either<ResourceAlreadyExistsError, initFormPayload> =>
    pipe(
      initForm,
      E.fromPredicate(flow(isInitFormIdUniq(state)), flow(mapFormIds, resourceAlreadyExistsError)),
      E.flatMap(
        flow(E.fromPredicate(isInitFormPayloadUniq, flow(mapFormIds, resourceAlreadyExistsError)))
      )
    )

export const createShareDataSlice: StateCreator<ShareDataSlice, [], [], ShareDataSlice> = (
  set,
  get
) => ({
  shareData: {
    form: [],
    storageServiceId: O.none,
    initForm: (payload: initFormPayload) =>
      pipe(
        payload,
        A.isEmpty,
        B.match(
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
          () => IOE.of(undefined)
        )
      ),
    formItemById: (id: FormItemId) =>
      pipe(
        IOO.fromIO(() => get().shareData.form),
        IOO.chainOptionK(flow(A.findFirst(formItem => eqFormItem.equals(formItem, { id }))))
      ),
    setFormItemValue: ({ id, value }: SetFormItemValuePayload) =>
      pipe(
        id,
        S.isEmpty,
        B.match(
          () =>
            pipe(
              IOE.fromIO(() => get().shareData.form),
              IOE.flatMap(
                flow(
                  setFormItemValueInvariant(id),
                  IOE.fromEither,
                  IOE.chainIOK(
                    formItemId => () =>
                      set(state => ({
                        shareData: {
                          ...state.shareData,
                          form: pipe(
                            state.shareData.form,
                            A.map(formItem =>
                              pipe(
                                eqFormItem.equals(formItem, { id: formItemId }),
                                B.match(
                                  () => formItem,
                                  () => ({ ...formItem, value })
                                )
                              )
                            )
                          )
                        }
                      }))
                  )
                )
              )
            ),
          () => IOE.of(undefined)
        )
      ),
    isFormInitialized: () => () => get().shareData.form.length > 0,
    setStorageServiceId: (id: O.Option<storageServiceId>) => () =>
      set(state => ({ shareData: { ...state.shareData, storageServiceId: id } }))
  }
})
