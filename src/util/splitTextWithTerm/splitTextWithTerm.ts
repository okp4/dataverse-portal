import { pipe } from 'fp-ts/lib/function'
import * as S from 'fp-ts/string'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'

const isNonEmpty = (s: string): boolean => !S.isEmpty(s)

// Removes invalid escape sequences from a string by replacing the backslash with nothing,
// thus preserving only the character that follows the backslash.
const replaceInvalidEscapeSequences = (s: string): string =>
  s.replace(/\\(x|u|U|v|b|B|c|C|f|n|r|t|0|1|2|3|4|5|6|7|8|9)/g, '$1')

// Escapes all special characters in a string that have significance in a regular expression,
// allowing the string to be used safely in a RegExp constructor.
const escapeRegExp = (s: string): string => s.replace(/[\^$.*+?()|[\]{}\\]/g, '\\$&')

/**
 * Splits a given text string at each occurrence of a specified search term.
 *
 * @param {string} text - The text to be split.
 * @param {string} term - The term to split the text by.
 * @returns {string[]} An array of strings. If the search term is an empty string, the array will contain the original text as its only element.
 * Otherwise, the array will contain segments of the original text, split at each occurrence of the search term (case-insensitive).
 * Each element in the array will be a non-empty string.
 */
export const splitTextWithTerm = (text: string, term: string): string[] =>
  pipe(
    term,
    replaceInvalidEscapeSequences,
    O.fromPredicate(isNonEmpty),
    O.fold(
      () => [text],
      t => pipe(text.split(new RegExp(`(${escapeRegExp(t)})`, 'giu')), A.filter(isNonEmpty))
    )
  )
