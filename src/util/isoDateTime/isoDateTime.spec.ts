import { convertToLocalizedYearIfISODateTime } from './isoDateTime'

describe('convertToLocalizedYearIfISODateTime', () => {
  test.each([
    ['2023-01-01T00:00:00', 'en', '2023'],
    ['2023-01-01T00:00:00.000', 'en', '2023'],
    ['2023-01-01T00:00:00.000Z', 'en', '2023'],
    ['002023-01-01T00:00:00.000+01:00', 'en', '002023-01-01T00:00:00.000+01:00'],
    ['2023-01-01T00:00:00', 'fr', '2023'],
    ['2023-01-01T00:00:00.000Z', 'fr', '2023'],
    ['Not an ISO DateTime', 'en', 'Not an ISO DateTime']
  ])(
    'converts input %s with locale %s to %s',
    (input: string, locale: string, expected: string) => {
      expect(convertToLocalizedYearIfISODateTime(input, locale)).toBe(expected)
    }
  )

  // Isolated test case for input with timezone offset
  test('converts input with timezone offset to the correct year', () => {
    const input = '2023-01-01T00:00:00.000+01:00'
    const lng = 'en'
    const result = convertToLocalizedYearIfISODateTime(input, lng)

    // Check if the result is either '2022' or '2023', depending on the system's timezone
    expect(['2022', '2023']).toContain(result)
  })
})
