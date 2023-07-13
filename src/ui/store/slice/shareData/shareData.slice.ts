/* eslint-disable max-lines-per-function */
import type { StateCreator } from 'zustand'
import * as A from 'fp-ts/Array'
import type { IOEither } from 'fp-ts/IOEither'
import * as IOE from 'fp-ts/IOEither'
import * as IOO from 'fp-ts/IOOption'
import type { IOOption } from 'fp-ts/IOOption'
import { flow, pipe } from 'fp-ts/lib/function'
import type { Eq } from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/string'
import * as B from 'fp-ts/boolean'
import * as E from 'fp-ts/Either'
import * as N from 'fp-ts/number'
import { contramap as eqContramap } from 'fp-ts/Eq'
import { ResourceConflictError, ResourceNotFoundError } from '@/shared/error'

export type DatePickerValue = {
  from?: string
  to?: string
}

export type FormItemId = string
export type FormItemType = 'text' | 'numeric' | 'date' | 'select'
export type FormItemValue = string | string[] | number | DatePickerValue

export type FormItem = Readonly<{
  id: FormItemId
  type: FormItemType
  label: string
  value: FormItemValue
  required?: boolean
}>
export type Form = FormItem[]

export type SetFormItemValuePayload = { id: FormItemId; value: FormItemValue }

export type initFormItem = FormItem
export type initFormPayload = initFormItem[]

export type ShareDataSlice = {
  shareData: {
    form: Form
    initForm: (payload: initFormPayload) => IOEither<ResourceConflictError, void>
    setFormItemValue: (payload: SetFormItemValuePayload) => IOEither<ResourceNotFoundError, void>
    formItemById: (id: FormItemId) => IOOption<FormItem>
  }
}

const eqFormItemId: Eq<FormItemId> = S.Eq
const eqFormItem: Eq<{ id: string }> = pipe(
  eqFormItemId,
  eqContramap(it => it.id)
)

const resourceNotFoundError = (resourceId: FormItemId): ResourceNotFoundError =>
  ResourceNotFoundError(resourceId)
const resourceConflictError = (resourceIds: FormItemId[]): ResourceConflictError =>
  ResourceConflictError(resourceIds)

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
  (state: Form): E.Either<ResourceConflictError, initFormPayload> =>
    pipe(
      initForm,
      E.fromPredicate(flow(isInitFormIdUniq(state)), flow(mapFormIds, resourceConflictError)),
      E.flatMap(
        flow(E.fromPredicate(isInitFormPayloadUniq, flow(mapFormIds, resourceConflictError)))
      )
    )

export const createShareDataSlice: StateCreator<ShareDataSlice, [], [], ShareDataSlice> = (
  set,
  get
) => ({
  shareData: {
    form: [],
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
      )
  }
})
