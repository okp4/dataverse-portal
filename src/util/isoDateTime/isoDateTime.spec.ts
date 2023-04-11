import { convertToLocalizedDateIfISODateTime } from './isoDateTime'
import * as E from 'fp-ts/Either'

describe('convertToLocalizedDateIfISODateTime', () => {
  test.each([
    ['2023-02-01T00:00:00', 'en', E.right('02/01/2023')],
    ['2023-02-01T00:00:00.000', 'en', E.right('02/01/2023')],
    ['2023-02-01T00:00:00.000Z', 'en', E.right('02/01/2023')],
    ['002023-01-01T00:00:00.000+01:00', 'en', E.left(new Error('Invalid Date'))],
    ['2023-02-01T00:00:00', 'fr', E.right('01/02/2023')],
    ['2023-02-01T00:00:00.000Z', 'fr', E.right('01/02/2023')],
    ['Not an ISO DateTime', 'en', E.left(new Error('Invalid Date'))]
  ])(
    'converts input %s with locale %s to %s',
    (input: string, locale: string, expected: E.Either<Error, string>) => {
      expect(convertToLocalizedDateIfISODateTime(input, locale)).toEqual(expected)
    }
  )

  // Isolated test case for input with timezone offset
  test('converts input with timezone offset to the correct year', () => {
    const input = '2023-01-01T00:00:00.000+01:00'
    const lng = 'en'
    const result = convertToLocalizedDateIfISODateTime(input, lng)

    // Check if the result is either '2022' or '2023', depending on the system's timezone
    expect([E.right('12/31/2022'), E.right('01/01/2023')]).toContainEqual(result)
  })
})
