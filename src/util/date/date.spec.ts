import { formatDateToPattern, formatISODate, localizedDateFormatter } from './date'

// eslint-disable-next-line max-lines-per-function
describe('Date utilities', () => {
  describe('Considering the formatDateToPattern function', () => {
    describe.each`
      options                                                  | locale       | pattern                                     | expectedOutput
      ${{ year: 'numeric', month: 'long', day: 'numeric' }}    | ${'en-US'}   | ${{ day: 'DD', month: 'MM', year: 'YYYY' }} | ${'MM DD, YYYY'}
      ${{ year: 'numeric', month: 'long' }}                    | ${'en-US'}   | ${{ day: 'DD', month: 'MM', year: 'YYYY' }} | ${'MM YYYY'}
      ${{ month: '2-digit', day: '2-digit' }}                  | ${'en-US'}   | ${{ day: 'DD', month: 'MM', year: 'YYYY' }} | ${'MM/DD'}
      ${{ month: 'numeric', day: 'numeric' }}                  | ${'en-US'}   | ${{ day: 'DD', month: 'MM', year: 'YYYY' }} | ${'MM/DD'}
      ${{ year: 'numeric', day: '2-digit' }}                   | ${'en-US'}   | ${{ day: 'DD', month: 'MM', year: 'YYYY' }} | ${'YYYY (day: DD)'}
      ${{ year: 'numeric' }}                                   | ${undefined} | ${{ year: 'YY' }}                           | ${'YY'}
      ${{ year: 'numeric', month: '2-digit', day: '2-digit' }} | ${'fr-FR'}   | ${{ day: 'DD', month: 'MM', year: 'YYYY' }} | ${'DD/MM/YYYY'}
      ${{ year: 'numeric', month: '2-digit', day: '2-digit' }} | ${'de'}      | ${{ day: 'DD', month: 'MM', year: 'YYYY' }} | ${'DD.MM.YYYY'}
    `(
      'Given options $options, locale $locale, and pattern $pattern',
      ({ options, locale, pattern, expectedOutput }) => {
        describe('When calling formatDateToPattern()', () => {
          test(`Then, expect the formatted date pattern to be '${expectedOutput}'`, () => {
            expect(formatDateToPattern(pattern, options, locale)).toEqual(expectedOutput)
          })
        })
      }
    )
  })

  describe('Considering the formatISODate function', () => {
    describe.each`
      isoDateString   | options                                               | locale  | expectedOutput
      ${'2023-09-26'} | ${{ year: 'numeric', month: 'long', day: 'numeric' }} | ${'en'} | ${'September 26, 2023'}
      ${'2023-09-26'} | ${{ year: 'numeric', month: '2-digit' }}              | ${'en'} | ${'09/2023'}
      ${'2023-09-26'} | ${{ year: 'numeric' }}                                | ${'en'} | ${'2023'}
      ${'2023-09-26'} | ${{ year: 'numeric', day: '2-digit' }}                | ${'fr'} | ${'2023 (jour: 26)'}
      ${'2023-09-26'} | ${{ year: '2-digit' }}                                | ${'fr'} | ${'23'}
      ${'2023-09-26'} | ${{ month: '2-digit', day: '2-digit' }}               | ${'de'} | ${'26.09.'}
      ${'2023-09-26'} | ${{ month: 'long' }}                                  | ${'de'} | ${'September'}
    `(
      'Given a valid ISO date string $isoDateString with options $options and locale $locale',
      ({ isoDateString, options, locale, expectedOutput }) => {
        const formatter = localizedDateFormatter(options, locale)

        test(`When calling formatISODate(), then expect the output to be '${expectedOutput}'`, () => {
          const result = formatISODate(formatter, isoDateString)
          expect(result).toBe(expectedOutput)
        })
      }
    )

    describe.each`
      isoDateString     | options                                               | locale
      ${''}             | ${{ year: 'numeric', month: 'long', day: 'numeric' }} | ${'en'}
      ${'invalid-date'} | ${{ year: '2-digit' }}                                | ${'fr'}
      ${'invalid-date'} | ${{ month: 'long' }}                                  | ${'de'}
    `(
      'Given an invalid ISO date string $isoDateString with options $options and locale $locale',
      ({ isoDateString, options, locale }) => {
        const formatter = localizedDateFormatter(options, locale)

        test('When calling formatISODate(), then expect it to throw a RangeError', () => {
          expect(() => formatISODate(formatter, isoDateString)).toThrow(RangeError)
        })
      }
    )
  })
})
