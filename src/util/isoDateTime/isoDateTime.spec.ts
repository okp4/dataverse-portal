import { isISODateTime } from './isoDateTime'

describe('isISODateTime', () => {
  test.each([
    ['2023', false],
    ['2023-01', false],
    ['2023-01-01', false],
    ['2023-01-01T00:00', false],
    ['2023-01-01T00:00:00', true],
    ['2023-01-01T00:00:00.000', true],
    ['2023-01-01T00:00:00.000Z', true],
    ['2023-01-01T00:00:00.000+01:00', true],
    ['2023-01-01T00:00:00.000-01:00', true],
    ['002023-01-01T00:00:00.000+01:00', false]
  ])('validates input %s as %s', (input: string, expected: boolean) => {
    expect(isISODateTime(input)).toBe(expected)
  })
})
