import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { fromPredicate } from 'fp-ts/Either'

const getLocalizedDate = (date: Date, locale: string): E.Either<Error, string> =>
  pipe(
    new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' }),
    fromPredicate(
      dateTimeFormat => dateTimeFormat instanceof Intl.DateTimeFormat,
      () => new Error('Invalid Locale')
    ),
    E.map(formatter => formatter.format(date))
  )

export const parseAndValidateISODateTime = (input: string): E.Either<Error, Date> =>
  pipe(
    Date.parse(input),
    fromPredicate(
      timestamp => !isNaN(timestamp),
      () => new Error('Invalid Date')
    ),
    E.map(timestamp => new Date(timestamp))
  )

export const convertToLocalizedDateIfISODateTime = (
  input: string,
  locale: string
): E.Either<Error, string> =>
  pipe(
    parseAndValidateISODateTime(input),
    E.chain(date => getLocalizedDate(date, locale))
  )
