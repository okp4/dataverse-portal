/**
 * @jest-environment jsdom
 */

import type { RenderHookResult } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import { useAppStore } from '@/ui/store/appStore'
import type { Form, FormItem, ShareDataFormSlice } from '../shareDataForm.slice'
import * as O from 'fp-ts/Option'
import type { Renderer } from 'react-dom'

// eslint-disable-next-line max-lines-per-function
describe('Considering the ShareDataFormSlice', () => {
  // Initialize render hook function from react-testing-library
  let renderedHook: RenderHookResult<ShareDataFormSlice, Renderer>

  // Initial form payloads
  const initialForm1: Form = [
    {
      id: '1',
      label: 'title',
      value: ''
    }
  ]
  const initialForm2: Form = [
    {
      id: '2',
      label: 'tags',
      value: []
    }
  ]
  const initialForm3: Form = [
    {
      id: '3',
      label: 'fees',
      value: 0
    }
  ]
  const initialForm4: Form = [
    {
      id: '4',
      label: 'date',
      value: {}
    }
  ]

  // Form Item payloads
  const formItemPayload1 = { id: '1', value: 'foo' }
  const formItemPayload2 = { id: '2', value: ['foo', 'bar'] }
  const formItemPayload3 = { id: '3', value: 777 }
  const formItemPayload4 = { id: '4', value: { from: '2023-02-01T00:00:00.000Z' } }

  // Expected forms
  const expectedForm1: Form = [{ ...formItemPayload1, label: 'title' }]
  const expectedForm2: Form = [{ ...formItemPayload2, label: 'tags' }]
  const expectedForm3: Form = [{ ...formItemPayload3, label: 'fees' }]
  const expectedForm4: Form = [{ ...formItemPayload4, label: 'date' }]

  // Expected form items
  const expectedFormItem1: FormItem = {
    id: '1',
    label: 'title',
    value: ''
  }
  const expectedUpdatedFormItem1: FormItem = {
    id: '1',
    label: 'title',
    value: 'foo'
  }

  const expectedFormItem2: FormItem = {
    id: '2',
    label: 'tags',
    value: ['foo', 'bar']
  }

  const expectedFormItem3: FormItem = {
    id: '3',
    label: 'fees',
    value: 777
  }

  const expectedFormItem4: FormItem = {
    id: '4',
    label: 'date',
    value: { from: '2023-02-01T00:00:00.000Z' }
  }

  describe.each`
    initialForm     | formItemPayload     | id           | expectedForm     | expectedFormItem
    ${undefined}    | ${undefined}        | ${undefined} | ${[]}            | ${O.none}
    ${initialForm1} | ${undefined}        | ${'4'}       | ${initialForm1}  | ${O.none}
    ${initialForm1} | ${undefined}        | ${'1'}       | ${initialForm1}  | ${O.some(expectedFormItem1)}
    ${initialForm1} | ${formItemPayload1} | ${'1'}       | ${expectedForm1} | ${O.some(expectedUpdatedFormItem1)}
    ${initialForm2} | ${formItemPayload2} | ${undefined} | ${expectedForm2} | ${O.none}
    ${initialForm2} | ${formItemPayload2} | ${'2'}       | ${expectedForm2} | ${O.some(expectedFormItem2)}
    ${initialForm3} | ${formItemPayload3} | ${undefined} | ${expectedForm3} | ${O.none}
    ${initialForm3} | ${formItemPayload3} | ${'3'}       | ${expectedForm3} | ${O.some(expectedFormItem3)}
    ${initialForm4} | ${formItemPayload4} | ${'4'}       | ${expectedForm4} | ${O.some(expectedFormItem4)}
  `(
    `Given an initial form <$initialForm> and a form item payload <$formItemPayload>`,
    ({ initialForm, formItemPayload, id, expectedForm, expectedFormItem }) => {
      beforeEach(() => {
        renderedHook = renderHook(() => useAppStore())
      })

      describe('When setting formItem value after intialization', () => {
        test(`Then expect form to be ${expectedForm} and selected formItem to be ${expectedFormItem}`, () => {
          if (initialForm) act(() => renderedHook.result.current.init(initialForm)())
          if (formItemPayload)
            act(() =>
              renderedHook.result.current.setFormItemValue(
                formItemPayload.id,
                formItemPayload.value
              )()
            )
          if (id) {
            const formItem = renderedHook.result.current.formItemById(id)()
            expect(formItem).toBeOption()
            expect(formItem).toStrictEqual(expectedFormItem)
          }
          expect(renderedHook.result.current.form).toStrictEqual(expectedForm)
        })
      })
    }
  )
})
