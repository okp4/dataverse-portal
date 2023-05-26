import { pipe } from 'fp-ts/lib/function'
import * as S from 'fp-ts/string'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'

/**
 * Splits a given text string at each occurrence of a specified search term.
 *
 * @param {string} text - The text to be split.
 * @param {string} term - The term to split the text by.
 * @returns {string[]} An array of strings. If the search term is an empty string, the array will contain the original text as its only element.
 * Otherwise, the array will contain segments of the original text, split at each occurrence of the search term (case-insensitive).
 * Each element in the array will be a non-empty string.
 */
const isNonEmpty = (s: string): boolean => !S.isEmpty(s)

export const splitTextByTerm = (text: string, term: string): string[] =>
  pipe(
    term,
    O.fromPredicate(isNonEmpty),
    O.fold(
      () => [text],
      t => pipe(text.split(new RegExp(`(${t})`, 'gi')), A.filter(isNonEmpty))
    )
  )
