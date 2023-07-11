import type { StateCreator } from 'zustand'
import * as A from 'fp-ts/Array'
import type { IO } from 'fp-ts/IO'
import * as IOO from 'fp-ts/IOOption'
import { flow, pipe } from 'fp-ts/lib/function'
import type { Eq } from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/string'
import * as B from 'fp-ts/boolean'
import { contramap as eqContramap } from 'fp-ts/Eq'

export type FormItemId = string

export type FormItemValue = string | string[] | number | DatePickerValue
export type DatePickerValue = {
  from?: string
  to?: string
}

export type FormItem = Readonly<{
  id: FormItemId
  value: FormItemValue
  required?: boolean
}>

export type Form = FormItem[]

export type ShareDataFormSlice = {
  form: Form
  init: (initialForm: Form) => IO<void>
  setFormItemValue: (id: FormItemId, value: FormItemValue) => IO<void>
  formItemById: (id: FormItemId) => IOO.IOOption<FormItem>
}

const eqFormItemId: Eq<FormItemId> = S.Eq
const eqFormItem: Eq<{ id: string }> = pipe(
  eqFormItemId,
  eqContramap(it => it.id)
)

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
  setFormItemValue: (id: FormItemId, value: FormItemValue) => () =>
    set(state => ({
      form: pipe(
        state.form,
        A.map(formItem =>
          pipe(
            eqFormItem.equals(formItem, { id }),
            B.match(
              () => formItem,
              () => ({ ...formItem, value })
            )
          )
        )
      )
    }))
})
