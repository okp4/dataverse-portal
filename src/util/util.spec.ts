import * as O from 'fp-ts/Option'
import {
  getURILastElement,
  isError,
  isSubstringOf,
  escapeSparqlStr,
  updateItemById,
  without
} from './util'
import type { Item } from './util'

type Data = {
  arg: string
  expectedResult: string
}

describe('Considering the getURILastElement() function', () => {
  describe.each`
    arg                   | expectedResult
    ${'id:test/foo'}      | ${O.some('foo')}
    ${'id:test/foo/bar'}  | ${O.some('bar')}
    ${'id:test/foo/bar/'} | ${O.some('')}
    ${''}                 | ${O.some('')}
    ${'/'}                | ${O.some('')}
    ${'id:test#foo'}      | ${O.some('id:test#foo')}
  `('Given an argument <"$arg">', ({ arg, expectedResult }: Data) => {
    describe('When calling function getURILastElement()', () => {
      const result = getURILastElement(arg)
      test('Then, the result is as expected', () => {
        expect(result).toStrictEqual(expectedResult)
      })
    })
  })
})

describe('isSubstringOf', () => {
  it('returns true when the substring exists within the source string', () => {
    expect(isSubstringOf('test', 'This is a test')).toBeTruthy()
    expect(isSubstringOf('TEST', 'This is a test')).toBeTruthy()
    expect(isSubstringOf('Test', 'This is a test')).toBeTruthy()
  })

  it('returns false when the substring does not exist within the source string', () => {
    expect(isSubstringOf('example', 'This is a test')).toBeFalsy()
    expect(isSubstringOf('TESTING', 'This is a test')).toBeFalsy()
  })

  it('returns false when the source string is empty', () => {
    expect(isSubstringOf('test', '')).toBeFalsy()
  })

  it('returns true when the substring is empty', () => {
    expect(isSubstringOf('', 'This is a test')).toBeTruthy()
  })

  it('returns true when both strings are empty', () => {
    expect(isSubstringOf('', '')).toBeTruthy()
  })
})

describe('isError guard function', () => {
  describe.each`
    arg                                                                                   | expectedResult
    ${2}                                                                                  | ${false}
    ${{}}                                                                                 | ${false}
    ${true}                                                                               | ${false}
    ${null}                                                                               | ${false}
    ${undefined}                                                                          | ${false}
    ${new Error()}                                                                        | ${true}
    ${'test string'}                                                                      | ${false}
    ${new TypeError()}                                                                    | ${true}
    ${new SyntaxError()}                                                                  | ${true}
    ${{ name: 'Error', message: 'error test message', cause: 'to test', stack: 'stack' }} | ${false}
  `('Given an argument <"$arg">', ({ arg, expectedResult }: Data) => {
    describe('When checking the type of the value in the function isError(value)', () => {
      const result = isError(arg)
      test('Then, the result is as expected', () => {
        expect(result).toStrictEqual(expectedResult)
      })
    })
  })
})

describe('escapeSparqlStr', () => {
  describe.each`
    arg                    | expectedResult
    ${undefined}           | ${''}
    ${'\t'}                | ${'\\t'}
    ${'\n'}                | ${'\\n'}
    ${'\r'}                | ${'\\r'}
    ${'\b'}                | ${'\\b'}
    ${'\f'}                | ${'\\f'}
    ${'"'}                 | ${'\\"'}
    ${"'"}                 | ${"\\'"}
    ${'\\'}                | ${'\\\\'}
    ${'foo\nbar'}          | ${'foo\\nbar'}
    ${'foo\n'}             | ${'foo\\n'}
    ${'\nfoo'}             | ${'\\nfoo'}
    ${'foo"bar'}           | ${'foo\\"bar'}
    ${"foo'bar"}           | ${"foo\\'bar"}
    ${'foo\\bar'}          | ${'foo\\\\bar'}
    ${'foo\t\tbar\n\nbaz'} | ${'foo\\t\\tbar\\n\\nbaz'}
    ${'/foo^?*bar$baz+'}   | ${'/foo^?*bar$baz+'}
    ${'\\...🧪✌🏾'}         | ${'\\\\...🧪✌🏾'}
    ${'\\u00a0'}           | ${'\\\\u00a0'}
    ${'\u00a0'}            | ${' '}
    ${'\u005Cbar'}         | ${'\\\\bar'}
    ${'\\u005Cbar'}        | ${'\\\\u005Cbar'}
  `('When given argument <"$arg">', ({ arg, expectedResult }) => {
    it(`returns ${expectedResult}`, () => {
      expect(escapeSparqlStr(arg)).toBe(expectedResult)
    })
  })
})

describe('Given the updateItemById function,', () => {
  type Data = { id: string; items: Item[]; updatedItem: Item; expectedItems: [] }

  const items1 = [
    { id: '1', value: 'value1' },
    { id: '2', value: 'value2' },
    { id: '3', value: 'value3' }
  ]

  const updatedItem1 = { id: 1, value: 'value1UpdatedValue1' }
  const updatedItem2 = {
    id: '1',
    value: {
      name: 'item1',
      fee: 300,
      options: ['option1', 'option2']
    }
  }

  const expectedUpdatedItems1 = [
    updatedItem1,
    { id: '2', value: 'value2' },
    { id: '3', value: 'value3' }
  ]

  const expectedUpdatedItems2 = [
    { id: '1', value: 'value1' },
    updatedItem2,
    { id: '3', value: 'value3' }
  ]

  describe.each`
    id           | items     | updatedItem     | expectedItems
    ${undefined} | ${items1} | ${updatedItem1} | ${items1}
    ${null}      | ${items1} | ${updatedItem1} | ${items1}
    ${'110'}     | ${items1} | ${updatedItem1} | ${items1}
    ${'1'}       | ${items1} | ${updatedItem1} | ${expectedUpdatedItems1}
    ${'2'}       | ${items1} | ${updatedItem2} | ${expectedUpdatedItems2}
  `(
    `given an initial array of elements <$items1>`,
    ({ id, items, updatedItem, expectedItems }: Data) => {
      describe(`When updating an item by giving its id ${id}, its updated value ${updatedItem} and the items list ${items}`, () => {
        test(`Then, the expect items are expected to be ${JSON.stringify(expectedItems)}`, () => {
          const result = updateItemById(id, items, updatedItem)
          expect(result).toStrictEqual(expectedItems)
        })
      })
    }
  )
})

describe('without utility function', () => {
  it('filters out numbers', () => {
    const itemsToRemove = [1, 2]
    const myArray = [1, 2, 3, 4, 5]
    const filteredArray = without(itemsToRemove)(myArray)
    expect(filteredArray).toEqual([3, 4, 5])
  })

  it('filters out strings', () => {
    const stringsToRemove = ['a', 'b']
    const myStringArray = ['a', 'b', 'c', 'd']
    const filteredStringArray = without(stringsToRemove)(myStringArray)
    expect(filteredStringArray).toEqual(['c', 'd'])
  })

  it('handles empty arrays', () => {
    const itemsToRemove: number[] = []
    const myArray = [1, 2, 3, 4, 5]
    const filteredArray = without(itemsToRemove)(myArray)
    expect(filteredArray).toEqual([1, 2, 3, 4, 5])
  })

  it('handles removing from an empty array', () => {
    const itemsToRemove = [1, 2, 3]
    const myArray: number[] = []
    const filteredArray = without(itemsToRemove)(myArray)
    expect(filteredArray).toEqual([])
  })

  it('handles arrays of objects with shared references', () => {
    const object1 = { id: 1 }
    const object2 = { id: 2 }
    const object3 = { id: 3 }
    const objectsToRemove = [object1, object2]
    const myObjectArray = [object1, object2, object3]
    const filteredObjectArray = without(objectsToRemove)(myObjectArray)
    expect(filteredObjectArray).toEqual([object3])
  })

  it('does not handle arrays of objects with different references', () => {
    const objectsToRemove = [{ id: 1 }, { id: 2 }]
    const myObjectArray = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const filteredObjectArray = without(objectsToRemove)(myObjectArray)
    expect(filteredObjectArray).not.toEqual([{ id: 3 }])
  })
})
