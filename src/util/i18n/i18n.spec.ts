/* eslint-disable max-lines-per-function */
import {
  decimalSeparatorForLocale,
  localizedNumberFormatter,
  localizedNumberParser,
  thousandSeparatorForLocale
} from './i18n'

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

  describe('localizedNumberFormatter', () => {
    describe.each([
      [
        'fr-FR',
        { minimumFractionDigits: 0, maximumFractionDigits: 2 },
        '.',
        ' ',
        1234.56,
        '1 234.56'
      ],
      [
        'fr-FR',
        { minimumFractionDigits: 0, maximumFractionDigits: 2 },
        '.',
        undefined,
        1234.56,
        '1 234.56'
      ],
      [
        'fr-FR',
        { minimumFractionDigits: 0, maximumFractionDigits: 2 },
        undefined,
        undefined,
        1234.568,
        '1 234,57'
      ],
      [
        'en-US',
        { minimumFractionDigits: 0, maximumFractionDigits: 2 },
        undefined,
        undefined,
        1234.568,
        '1,234.57'
      ],
      [
        'en-US',
        { minimumFractionDigits: 0, maximumFractionDigits: 2 },
        ',',
        '.',
        1234.568,
        '1.234,57'
      ]
    ])(
      'formatLocalizedNumber',
      (locale, options, decimalSeparator, thousandSeparator, input, expectedOutput) => {
        it(`formats a number according to the specified locale, options, and separators`, () => {
          const formatter = localizedNumberFormatter(
            options,
            locale,
            decimalSeparator,
            thousandSeparator
          )
          expect(formatter(input)).toEqual(expectedOutput)
        })
      }
    )

    it('throws an error when decimal and thousand separators are the same', () => {
      expect(() => {
        localizedNumberFormatter({}, 'en-US', '.', '.')
      }).toThrow('Decimal and thousand separators must be different')
    })
  })

  describe('localizedNumberParser', () => {
    describe.each([
      ['fr-FR', '.', ' ', '1 234.56', 1234.56],
      ['fr-FR', '.', undefined, '1 234.56', 1234.56],
      ['fr-FR', undefined, undefined, '1 234,57', 1234.57],
      ['en-US', undefined, undefined, '1,234.57', 1234.57],
      ['en-US', ',', '.', '1.234,57', 1234.57]
    ])(
      'parseLocalizedNumber',
      (locale, decimalSeparator, thousandSeparator, input, expectedOutput) => {
        it(`parses a formatted string according to the specified locale and separators`, () => {
          const parser = localizedNumberParser(locale, decimalSeparator, thousandSeparator)
          expect(parser(input)).toEqual(expectedOutput)
        })
      }
    )

    it('throws an error when decimal and thousand separators are the same', () => {
      expect(() => {
        localizedNumberParser('en-US', '.', '.')
      }).toThrow('Decimal and thousand separators must be different')
    })
  })

  describe('localizedNumberFormatter and localizedNumberParser', () => {
    const locales = ['en-US', 'fr-FR', 'de-DE']

    const testCases: Record<string, { number: number; formatted: string }[]> = {
      'en-US': [
        { number: 1234.56, formatted: '1,234.56' },
        { number: 0.2004, formatted: '0.2004' },
        { number: 987654.32, formatted: '987,654.32' }
      ],
      'fr-FR': [
        { number: 1234.56, formatted: '1 234,56' },
        { number: 0, formatted: '0' },
        { number: 987654.32, formatted: '987 654,32' }
      ],
      'de-DE': [
        { number: 1234.56, formatted: '1.234,56' },
        { number: 0.00001, formatted: '0,000001' },
        { number: -422, formatted: '-422' },
        { number: 987654.32, formatted: '987.654,32' }
      ]
    }

    locales.forEach(locale => {
      const format = localizedNumberFormatter(
        { minimumFractionDigits: 0, maximumFractionDigits: 6 },
        locale
      )
      const parse = localizedNumberParser(locale)
      const cases = testCases[locale]

      test(`parse ∘ format = Identity for locale ${locale}`, () => {
        cases.forEach(({ number }) => {
          expect(parse(format(number))).toBeCloseTo(number)
        })
      })

      test(`format ∘ parse = Identity for locale ${locale}`, () => {
        cases.forEach(({ formatted }) => {
          expect(format(parse(formatted))).toBe(formatted)
        })
      })
    })
  })
})
