import { pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as O from 'fp-ts/Option'

/**
 * Determines the character used as the thousand separator for a locale.
 *
 * @param {string} locale - The locale to use for determining the thousand separator, e.g., 'en-US' or 'fr-FR'.
 * @returns {string} - The character used as the thousand separator in the specified locale.
 * @example thousandSeparatorForLocale('de-DE') // '.'
 * @example thousandSeparatorForLocale('en-US') // ','
 */

export const thousandSeparatorForLocale = (locale: string): string =>
  new Intl.NumberFormat(locale, { useGrouping: true }).format(1111).replace(/1/g, '')

/**
 * Determines the character used as the decimal separator for a locale.
 *
 * @param {string} locale - The locale to use for determining the decimal separator, e.g., 'en-US' or 'fr-FR'.
 * @returns {string} - The character used as the decimal separator in the specified locale.
 * @example decimalSeparatorForLocale('fr-FR') // ','
 * @example decimalSeparatorForLocale('en-US') // '.'
 */
export const decimalSeparatorForLocale = (locale: string): string =>
  new Intl.NumberFormat(locale, { useGrouping: false }).format(1.1).replace(/1/g, '')

/**
 * Returns a function that formats a number according to the specified locale and options.
 * The returned function replaces the decimal separator with the specified one.
 *
 * @param {string} locale - The locale to use for number formatting, e.g., 'en-US' or 'fr-FR'.
 * @param {Intl.NumberFormatOptions} options - The options to use for number formatting.
 * @param {string=} decimalSeparator - The character used as the decimal separator.
 * @returns {(n: number) => string} - A function that formats a number according to the specified locale, options and decimal separator.
 */
export const localizedNumberFormatter =
  (locale: string, options: Intl.NumberFormatOptions, decimalSeparator?: string) =>
  (n: number): string => {
    const formattedNumber = n.toLocaleString(locale, options)

    return pipe(
      O.fromNullable(decimalSeparator),
      O.map(decimalSeparator =>
        pipe(formattedNumber, S.replace(decimalSeparatorForLocale(locale), decimalSeparator))
      ),
      O.getOrElse(() => formattedNumber)
    )
  }
