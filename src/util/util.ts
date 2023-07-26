import * as O from 'fp-ts/Option'
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

/**
 * Returns a function that checks if a string s is a valid number format.
 *
 * @param {string} thousandSeparator - The character used as the thousand separator.
 * @param {string} decimalSeparator - The character used as the decimal separator.
 * @param {number} decimalLimit - The maximum number of digits that can follow the decimal separator.
 * @returns {(s: string) => O.Option<string>} - A function that checks if a given string s is a valid number format according to the specified configuration.
 * Returns an fp-ts Option of the string if it is valid, and fp-ts None otherwise.
 * @example isValidNumberFieldFormat({ thousandSeparator: '\u202F', decimalSeparator: '.', decimalLimit: 2 })('123.') // some('123.')
 * @example isValidNumberFieldFormat({ thousandSeparator: '\u202F', decimalSeparator: ',', decimalLimit: 2 })('123.1') // some('123.1')
 */
export const numberFormatValidator =
  (thousandSeparator: string, decimalSeparator: string, decimalLimit: number) =>
  (s: string): O.Option<string> => {
    const regex = new RegExp(
      `^(\\d*(${escapeRegExp(thousandSeparator)}\\d{3})*(${escapeRegExp(
        decimalSeparator
      )}\\d{0,${decimalLimit}})?)$`
    )
    return pipe(
      s,
      O.fromPredicate(s => regex.test(s))
    )
  }
