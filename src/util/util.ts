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

// Escapes all special characters in a string that have significance in a regular expression,
// allowing the string to be used safely in a RegExp constructor.
export const escapeRegExp = (s: string): string => s.replace(/[\^$.*+?()|[\]{}\\]/g, '\\$&')

/**
 * Tests if a string ends with a decimal separator followed by one or more zeros.
 *
 * @param {string} s - The string to be tested.
 * @returns {boolean} - Returns `true` if the string ends with a decimal separator followed by one or more zeros, and `false` otherwise.
 */
export const endsZeroDotted = (s: string): boolean => /[.,]\d*0+$/.test(s)
