import {
  decimalSeparatorForLocale,
  localizedNumberFormatter,
  thousandSeparatorForLocale
} from './i18n'

describe('I18n utility', () => {
  describe('localizedNumberFormatter', () => {
    describe.each([
      ['fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }, '.', 1234.56, '1 234.56'],
      [
        'fr-FR',
        { minimumFractionDigits: 0, maximumFractionDigits: 2 },
        undefined,
        1234.568,
        '1 234,57'
      ],
      [
        'en-US',
        { minimumFractionDigits: 0, maximumFractionDigits: 2 },
        undefined,
        1234.568,
        '1,234.57'
      ]
    ])('formatLocalizedNumber', (locale, options, decimalSeparator, input, expectedOutput) => {
      it(`formats a number according to the specified locale and options`, () => {
        const formatter = localizedNumberFormatter(locale, options, decimalSeparator)
        expect(formatter(input)).toEqual(expectedOutput)
      })
    })
  })

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
