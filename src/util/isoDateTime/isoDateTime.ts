import i18n from '@/ui/i18n'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { fromPredicate } from 'fp-ts/Either'

const getLocalizedYear = (date: Date, locale: string): string =>
  pipe(new Intl.DateTimeFormat(locale, { year: 'numeric' }), formatter => formatter.format(date))

export const isISODateTime = (input: string): boolean => {
  const isoDateTimeRegex: RegExp =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d{1,6})?(([+-])(\d{2}):(\d{2})|Z)?$/

  return isoDateTimeRegex.test(input) && new Date(input).toString() !== 'Invalid Date'
}

export const isValidLocale = (locale: string): boolean => {
  const loadedLocales = Object.keys(i18n.options.resources ?? {})

  return loadedLocales.includes(locale)
}

export const parseISODateTime = (input: string): E.Either<Error, Date> =>
  pipe(
    input,
    fromPredicate(isISODateTime, () => new Error('Invalid date')),
    E.map(validISODateTime => new Date(validISODateTime))
  )

export const convertToLocalizedYearIfISODateTime = (
  input: string,
  locale: string
): E.Either<Error, string> =>
  pipe(
    locale,
    fromPredicate(isValidLocale, () => new Error('Invalid locale')),
    E.chain(() => parseISODateTime(input)),
    E.map(date => getLocalizedYear(date, locale))
  )
