import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { fromPredicate } from 'fp-ts/Either'

const getLocalizedYear = (date: Date, locale: string): string =>
  pipe(new Intl.DateTimeFormat(locale, { year: 'numeric' }), formatter => formatter.format(date))

export const isValidLocale = (locale: string, resources: Record<string, unknown>): boolean => {
  const loadedLocales = Object.keys(resources)
  return loadedLocales.includes(locale)
}

export const parseAndValidateISODateTime = (input: string): E.Either<Error, Date> =>
  pipe(
    Date.parse(input),
    fromPredicate(
      timestamp => !isNaN(timestamp),
      () => new Error('Invalid Date')
    ),
    E.map(timestamp => new Date(timestamp))
  )

export const convertToLocalizedYearIfISODateTime = (
  input: string,
  locale: string,
  resources: Record<string, unknown>
): E.Either<Error, string> =>
  pipe(
    locale,
    fromPredicate(
      l => isValidLocale(l, resources),
      () => new Error('Invalid locale')
    ),
    E.chain(() => parseAndValidateISODateTime(input)),
    E.map(date => getLocalizedYear(date, locale))
  )
