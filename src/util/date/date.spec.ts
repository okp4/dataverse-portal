import { formatDateToPattern } from './date'

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
})
