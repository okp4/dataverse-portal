import { none, some } from 'fp-ts/Option'
import { numberFormatValidator } from '@/util/field/field'

describe('Field utility functions', () => {
  describe('numberFormatValidator', () => {
    const thousandSeparator = ' '
    const decimalSeparator = '.'
    const decimalLimit = 2
    const validate = numberFormatValidator(thousandSeparator, decimalSeparator, decimalLimit)

    it('returns none when the string contains several occurences of a decimal separator', () => {
      expect(validate('123.123.123')).toEqual(none)
      expect(validate('123..')).toEqual(none)
      expect(validate('..123')).toEqual(none)
    })

    it('returns none when the string starts with a leading dash (-)', () => {
      expect(validate('-123')).toEqual(none)
    })

    it('returns none when the string contains non-alphanumeric characters that does not belong to separators', () => {
      expect(validate('123%')).toEqual(none)
      expect(validate('Hello')).toEqual(none)
    })

    it('returns none when the string contains more decimal than the limit', () => {
      expect(validate('12.345')).toEqual(none)
    })

    it('returns none when the string contains thousands separators at the wrong position', () => {
      expect(validate('1 2345')).toEqual(none)
      expect(validate('123 45')).toEqual(none)
    })

    it('returns none when the string ends with a thousand separator', () => {
      expect(validate('123 ')).toEqual(none)
    })

    it('returns some when the string ends with a decimal separator', () => {
      expect(validate('123.')).toEqual(some('123.'))
    })

    it('returns some when the string format is valid', () => {
      expect(validate('')).toEqual(some(''))
      expect(validate('123.12')).toEqual(some('123.12'))
      expect(validate('12 345')).toEqual(some('12 345'))
      expect(validate('12 345 678')).toEqual(some('12 345 678'))
      expect(validate('12 345 678.2')).toEqual(some('12 345 678.2'))
    })
  })
})
