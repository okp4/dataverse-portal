import { decimalSeparatorForLocale, thousandSeparatorForLocale } from './i18n'

describe('I18n utilities', () => {
  describe('thousandSeparatorForLocale', () => {
    it('returns the correct thousand separator for the locale', () => {
      expect(thousandSeparatorForLocale('fr-FR')).toEqual('\u202F') // narrow no-break space
      expect(thousandSeparatorForLocale('en-US')).toEqual(',')
      expect(thousandSeparatorForLocale('de-DE')).toEqual('.')
    })
  })

  describe('decimalSeparatorForLocale', () => {
    it('returns the correct decimal separator for the locale', () => {
      expect(decimalSeparatorForLocale('fr-FR')).toEqual(',')
      expect(decimalSeparatorForLocale('en-US')).toEqual('.')
      expect(decimalSeparatorForLocale('de-DE')).toEqual(',')
    })
  })
})
