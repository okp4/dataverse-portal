import { pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as O from 'fp-ts/Option'

/**
 * Returns a function that formats a given number according to the specified locale and options.
 * The returned function replaces the decimal separator with the specified one.
 *
 * @param {{ locale: string; options: Intl.NumberFormatOptions }} config - The configuration object.
 * @param {string} config.locale - The locale to use for number formatting, e.g., 'en-US' or 'fr-FR'.
 * @param {string} config.decimalSeparator - The character used as the decimal separator.
 * @param {Intl.NumberFormatOptions} config.options - The options to use for number formatting.
 * @returns {(n: number) => string} - A function that formats a given number according to the specified locale, options and decimal separator.
 */
export const formatLocalizedNumber =
  ({
    locale,
    options,
    decimalSeparator
  }: {
    locale: string
    options: Intl.NumberFormatOptions
    decimalSeparator?: string
  }) =>
  (n: number): string => {
    const formattedDecimalSeparator = new Intl.NumberFormat(locale, { useGrouping: false })
      .format(1.1)
      .replace(/1/g, '')

    const formattedNumber = n.toLocaleString(locale, options)

    return pipe(
      O.fromNullable(decimalSeparator),
      O.map(decimalSeparator =>
        pipe(formattedNumber, S.replace(formattedDecimalSeparator, decimalSeparator))
      ),
      O.getOrElse(() => formattedNumber)
    )
  }
