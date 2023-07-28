import { getURILastElement, isError, isSubstringOf, omit } from './util'
import * as O from 'fp-ts/Option'

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

describe('omit function', () => {
  it('returns an object with the specified properties omitted', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omit(obj, ['b', 'c'])
    expect(result).toEqual({ a: 1 })
  })

  it('returns the same object when there are no properties to omit', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omit(obj, [])
    expect(result).toEqual(obj)
  })

  it('returns an empty object when all properties are omitted', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omit(obj, ['a', 'b', 'c'])
    expect(result).toEqual({})
  })

  it('does not mutate the original object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    omit(obj, ['a'])
    expect(obj).toEqual({ a: 1, b: 2, c: 3 })
  })
})
