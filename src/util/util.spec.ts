import * as O from 'fp-ts/Option'
import {
  getURILastElement,
  isError,
  isSubstringOf,
  endsWithDecimalSeparatorAndZeros,
  numberFormatValidator
} from './util'

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

describe('endsWithDecimalSeparatorAndZeros', () => {
  it('returns true for strings ending with dot followed by zeroes', () => {
    expect(endsWithDecimalSeparatorAndZeros('12.00')).toBe(true)
    expect(endsWithDecimalSeparatorAndZeros('12.040')).toBe(true)
    expect(endsWithDecimalSeparatorAndZeros('120.400')).toBe(true)
  })

  it('returns false for strings without dot followed by zeroes', () => {
    expect(endsWithDecimalSeparatorAndZeros('12')).toBe(false)
    expect(endsWithDecimalSeparatorAndZeros('12.4')).toBe(false)
    expect(endsWithDecimalSeparatorAndZeros('120.104')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(endsWithDecimalSeparatorAndZeros('')).toBe(false)
  })
})

describe('numberFormatValidator', () => {
  const thousandSeparator = ' '
  const decimalSeparator = '.'
  const decimalLimit = 2
  const validate = numberFormatValidator(thousandSeparator, decimalSeparator, decimalLimit)

  it('returns none when the string contains several occurences of a decimal separator', () => {
    expect(validate('123.123.123')).toEqual(O.none)
    expect(validate('123..')).toEqual(O.none)
    expect(validate('..123')).toEqual(O.none)
  })

  it('returns none when the string starts with a leading dash (-)', () => {
    expect(validate('-123')).toEqual(O.none)
  })

  it('returns none when the string contains non-alphanumeric characters that does not belong to separators', () => {
    expect(validate('123%')).toEqual(O.none)
    expect(validate('Hello')).toEqual(O.none)
  })

  it('returns none when the string contains more decimal than the limit', () => {
    expect(validate('12.345')).toEqual(O.none)
  })

  it('returns none when the string contains thousands separators at the wrong position', () => {
    expect(validate('1 2345')).toEqual(O.none)
    expect(validate('123 45')).toEqual(O.none)
  })

  it('returns none when the string ends with a thousand separator', () => {
    expect(validate('123 ')).toEqual(O.none)
  })

  it('returns some when the string ends with a decimal separator', () => {
    expect(validate('123.')).toEqual(O.some('123.'))
  })

  it('returns some when the string format is valid', () => {
    expect(validate('')).toEqual(O.some(''))
    expect(validate('123.12')).toEqual(O.some('123.12'))
    expect(validate('12 345')).toEqual(O.some('12 345'))
    expect(validate('12 345 678')).toEqual(O.some('12 345 678'))
    expect(validate('12 345 678.2')).toEqual(O.some('12 345 678.2'))
  })
})
