import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import { escapeRegExp } from '@/util/util'

/**
 * Returns a function that checks if a given string s is a valid number field format.
 *
 * @param {{ thousandSeparator: string; decimalSeparator: string; decimalLimit: number }} config - The configuration object.
 * @param {string} config.thousandSeparator - The character used as the thousand separator.
 * @param {string} config.decimalSeparator - The character used as the decimal separator.
 * @param {number} config.decimalLimit - The maximum number of digits that can follow the decimal separator.
 * @returns {(s: string) => O.Option<string>} - A function that checks if a given string s is a valid number format according to the specified configuration.
 * Returns an fp-ts Option of the string if it is valid, and fp-ts None otherwise.
 * @example isValidNumberFieldFormat({ thousandSeparator: '\u202F', decimalSeparator: '.', decimalLimit: 2 })('123.') // some('123.')
 * @example isValidNumberFieldFormat({ thousandSeparator: '\u202F', decimalSeparator: ',', decimalLimit: 2 })('123.1') // some('123.1')
 */
export const isValidNumberFieldFormat =
  ({
    thousandSeparator,
    decimalSeparator,
    decimalLimit
  }: {
    thousandSeparator: string
    decimalSeparator: string
    decimalLimit: number
  }) =>
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
