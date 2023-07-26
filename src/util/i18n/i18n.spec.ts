import { localizedNumberFormatter } from './i18n'

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
})
