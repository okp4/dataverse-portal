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
