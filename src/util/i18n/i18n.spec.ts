import { formatLocalizedNumber } from './i18n'

describe('I18n utility functions', () => {
  describe.each([
    [
      {
        locale: 'fr-FR',
        options: { minimumFractionDigits: 0, maximumFractionDigits: 2 },
        decimalSeparator: '.'
      },
      1234.56,
      '1 234.56'
    ],
    [
      {
        locale: 'fr-FR',
        options: { minimumFractionDigits: 0, maximumFractionDigits: 2 }
      },
      1234.568,
      '1 234,57'
    ],
    [
      {
        locale: 'en-US',
        options: { minimumFractionDigits: 0, maximumFractionDigits: 2 }
      },
      1234.568,
      '1,234.57'
    ]
  ])('formatLocalizedNumber', (config, input, expectedOutput) => {
    it(`formats a number according to the specified locale and options`, () => {
      const formatter = formatLocalizedNumber(config)
      expect(formatter(input)).toEqual(expectedOutput)
    })
  })
})
