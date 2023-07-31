import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import * as T from 'fp-ts/Task'
import * as S from 'fp-ts/string'
import * as R from 'fp-ts/Record'
import * as RA from 'fp-ts/ReadonlyArray'
import { constant, flow, pipe } from 'fp-ts/function'
import { error, info, log, warn } from 'fp-ts/lib/Console'
import type { IO } from 'fp-ts/lib/IO'
import type { Task } from 'fp-ts/lib/Task'

export const getURILastElement = (str: string): O.Option<string> => pipe(str.split('/'), A.last)

export const taskLogger =
  <T>(message?: string, logLevel: 'error' | 'info' | 'log' | 'warn' = 'log') =>
  (task: Task<T>): Task<T> =>
    pipe(
      task,
      T.chainFirstIOK(
        flow(
          value => (message ? { message, value } : { value }),
          ((): (<A>(a: A) => IO<void>) => {
            switch (logLevel) {
              case 'error':
                return error
              case 'info':
                return info
              case 'log':
                return log
              case 'warn':
                return warn
            }
          })()
        )
      )
    )

export const isSubstringOf = (substring: string, source: string): boolean =>
  pipe(source, S.toLowerCase, S.includes(S.toLowerCase(substring)))

export const isError = (value: unknown): value is Error => value instanceof Error

export const escapeSparqlStr = (str?: string): string => {
  const escapeCharactersMap: Record<string, string> = {
    '\t': '\\t',
    '\n': '\\n',
    '\r': '\\r',
    '\b': '\\b',
    '\f': '\\f',
    '"': '\\"',
    "'": "\\'",
    '\\': '\\\\'
  }

  const lookupEscapeCharacter = (c: string): string =>
    pipe(escapeCharactersMap, R.lookup(c), O.getOrElse(constant(c)))

  return pipe(
    str,
    O.fromNullable,
    O.getOrElse(constant(S.empty)),
    S.split(S.empty),
    RA.map(lookupEscapeCharacter),
    RA.reduce(S.Monoid.empty, S.Monoid.concat)
  )
}
