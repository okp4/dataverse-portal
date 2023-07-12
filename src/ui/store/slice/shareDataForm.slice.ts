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
import { contramap as eqContramap } from 'fp-ts/Eq'
import { ResourceNotFoundError } from '@/shared/error'

export type FormItemId = string

export type FormItemType = 'text' | 'numeric' | 'date' | 'select'

export type FormItemValue = string | string[] | number | DatePickerValue
export type DatePickerValue = {
  from?: string
  to?: string
}

export type FormItem = Readonly<{
  id: FormItemId
  type: FormItemType
  label: string
  value: FormItemValue
  required?: boolean
}>

export type SetFormItemValuePayload = { id: FormItemId; value: FormItemValue }

export type Form = FormItem[]

export type FormPayload = Form

export type ShareDataFormSlice = {
  form: Form
  init: (payload: FormPayload) => IOEither<void, Error>
  setFormItemValue: (payload: SetFormItemValuePayload) => IOEither<ResourceNotFoundError, void>
  formItemById: (id: FormItemId) => IOOption<FormItem>
}

const eqFormItemId: Eq<FormItemId> = S.Eq
const eqFormItem: Eq<{ id: string }> = pipe(
  eqFormItemId,
  eqContramap(it => it.id)
)

const resourceNotFoundError = (resourceId: FormItemId): ResourceNotFoundError =>
  ResourceNotFoundError(resourceId)

const formIdExists =
  (state: Form) =>
  (formItemId: FormItemId): boolean =>
    A.some((formItem: FormItem) => formItem.id === formItemId)(state)

const setFormItemValueInvariant =
  (formItemId: FormItemId) =>
  (state: Form): E.Either<ResourceNotFoundError, FormItemId> =>
    pipe(formItemId, E.fromPredicate(flow(formIdExists(state)), resourceNotFoundError))

export const createShareDataFormSlice: StateCreator<
  ShareDataFormSlice,
  [],
  [],
  ShareDataFormSlice
> = (set, get) => ({
  form: [],
  init: (form: Form) => () => {
    set(() => ({
      form
    }))
  },
  formItemById: (id: FormItemId) =>
    pipe(
      IOO.fromIO(() => get().form),
      IOO.chainOptionK(flow(A.findFirst(formItem => eqFormItem.equals(formItem, { id }))))
    ),
  setFormItemValue: ({ id, value }: SetFormItemValuePayload) =>
    pipe(
      id,
      S.isEmpty,
      B.match(
        () =>
          pipe(
            IOE.fromIO(() => get().form),
            IOE.flatMap(
              flow(
                setFormItemValueInvariant(id),
                IOE.fromEither,
                IOE.chainIOK(
                  formItemId => () =>
                    set(state => ({
                      form: pipe(
                        state.form,
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
                    }))
                )
              )
            )
          ),
        () => IOE.of(undefined)
      )
    )
})
