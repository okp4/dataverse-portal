import type * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import * as T from 'fp-ts/Task'
import * as S from 'fp-ts/string'
import { flow, pipe } from 'fp-ts/function'
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
  const sparqlEscapeRegExp = /[\t\n\r\b\f"'\\]/g

  const escapeCharactersMap = new Map([
    ['\t', '\\t'],
    ['\n', '\\n'],
    ['\r', '\\r'],
    ['\b', '\\b'],
    ['\f', '\\f'],
    ['"', '\\"'],
    ["'", "\\'"],
    ['\\', '\\\\']
  ])

  return str ? str.replace(sparqlEscapeRegExp, char => escapeCharactersMap.get(char) as string) : ''
}
