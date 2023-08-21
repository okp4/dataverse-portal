import { pipe } from 'fp-ts/function'
import { escapeRegExp } from '@/util/util'

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
 * The returned function replaces the decimal and thousand separator with the specified one.
 *
 * @param {Intl.NumberFormatOptions} options - The options to use for number formatting.
 * @param {string=} locale - The locale to use for number formatting, e.g., 'en-US' or 'fr-FR'.
 * @param {string=} decimalSeparator - The character used as the decimal separator.
 * @param {string=} thousandSeparator - The character used as the thousand separator.
 * @returns {(n: number) => string} - A function that formats a number according to the specified locale, options and decimal separator.
 */
export const localizedNumberFormatter = (
  options: Intl.NumberFormatOptions,
  locale: string = 'en-US',
  decimalSeparator?: string,
  thousandSeparator?: string
): ((n: number) => string) => {
  if (decimalSeparator && thousandSeparator && decimalSeparator === thousandSeparator) {
    throw new Error('Decimal and thousand separators must be different')
  }
  const regexSeparator = new RegExp(
    `[${escapeRegExp(thousandSeparatorForLocale(locale))}${escapeRegExp(
      decimalSeparatorForLocale(locale)
    )}]`,
    'g'
  )
  const transformCallback = (match: string): string => {
    if (match === thousandSeparatorForLocale(locale) && thousandSeparator) return thousandSeparator
    if (match === decimalSeparatorForLocale(locale) && decimalSeparator) return decimalSeparator
    return match
  }

  const transformSeparators = (str: string): string =>
    str.replace(regexSeparator, transformCallback)

  return (n: number): string => pipe(n, n => n.toLocaleString(locale, options), transformSeparators)
}

/**
 * Returns a function that parses a localized number string according to the specified locale and options.
 * The returned function removes the thousand separator and replaces the decimal separator with a dot.
 *
 * @param {string=} locale - The locale to use for number formatting, e.g., 'en-US' or 'fr-FR'.
 * @param {string=} decimalSeparator - The character used as the decimal separator.
 * @param {string=} thousandSeparator - The character used as the thousand separator.
 * @returns {(n: number) => string} - A function that parses a localized number string according to the specified locale, thousand and decimal separator.
 */
export const localizedNumberParser = (
  locale: string = 'en-US',
  decimalSeparator: string = decimalSeparatorForLocale(locale),
  thousandSeparator: string = thousandSeparatorForLocale(locale)
): ((s: string) => number) => {
  if (decimalSeparator && thousandSeparator && decimalSeparator === thousandSeparator) {
    throw new Error('Decimal and thousand separators must be different')
  }

  const regexSeparator = new RegExp(
    `[${escapeRegExp(thousandSeparator)}${escapeRegExp(decimalSeparator)}]`,
    'g'
  )

  const transformCallback = (match: string): string => {
    if (match === thousandSeparator) return ''
    if (match === decimalSeparator) return '.'
    return match
  }

  const transformSeparators = (str: string): string =>
    str.replace(regexSeparator, transformCallback)

  return (formattedString: string): number => pipe(formattedString, transformSeparators, parseFloat)
}
