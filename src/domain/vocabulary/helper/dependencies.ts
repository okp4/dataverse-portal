import * as E from 'fp-ts/Either'
import * as S from 'fp-ts/string'
import * as P from 'fp-ts/Predicate'
import * as N from 'fp-ts/number'
import * as ORD from 'fp-ts/Ord'
import * as R from 'fp-ts/Record'
import { pipe } from 'fp-ts/function'
import type { Show } from 'fp-ts/lib/Show'
import type { Deps } from '../command'
import type { VocabularyPort } from '../port'

export type Option = (deps: Deps) => E.Either<VocabularyDependenciesError, Deps>

export const LanguageEmptyError = () =>
  ({
    _tag: 'language-empty'
  } as const)

/**
 *  Error when withLanguage() function is called with an empty language argument
 */
export type LanguageEmptyError = ReturnType<typeof LanguageEmptyError>

export const NegativeLimitError = (limit: number) =>
  ({
    _tag: 'negative-limit',
    limit
  } as const)

/**
 *  Error when withLimit() function is called with a negative limit argument
 */
export type NegativeLimitError = ReturnType<typeof NegativeLimitError>

export const GatewayTypeError = (gateway: unknown) =>
  ({
    _tag: 'gateway-type',
    gateway
  } as const)

/**
 *  Error when withVocabularyGateway() function is called with a gateway that not satisfy the VocabularyPort constraint
 */
export type GatewayTypeError = ReturnType<typeof GatewayTypeError>

export type VocabularyDependenciesError = LanguageEmptyError | NegativeLimitError | GatewayTypeError

export const ShowVocabularyDependenciesError: Show<VocabularyDependenciesError> = {
  show: (error: VocabularyDependenciesError): string => {
    switch (error._tag) {
      case 'language-empty': {
        return `Error ${error._tag}: The given language parameter cannot be empty`
      }
      case 'negative-limit': {
        return `Error ${error._tag}: The given limit parameter <${error.limit}> cannot be negative`
      }
      case 'gateway-type': {
        return `Error ${error._tag}: The given gateway parameter <${JSON.stringify(
          error.gateway
        )}> does not implement at least the retrieveVocabulary function`
      }
    }
  }
}

export const withVocabularyGateway =
  (gateway: VocabularyPort): Option =>
  (deps: Deps) =>
    pipe(
      gateway,
      E.fromPredicate((g: VocabularyPort) => R.has('retrieveVocabulary', g), GatewayTypeError),
      E.map(vocabularyGateway => ({
        ...deps,
        vocabularyGateway
      }))
    )

export const withLanguage =
  (lng: string): Option =>
  (deps: Deps) =>
    pipe(
      lng,
      E.fromPredicate(P.not(S.isEmpty), LanguageEmptyError),
      E.map(language => ({
        ...deps,
        language
      }))
    )

export const withLimit =
  (limit: number): Option =>
  (deps: Deps) =>
    pipe(
      limit,
      E.fromPredicate(x => ORD.gt(N.Ord)(x, 0), NegativeLimitError),
      E.map(l => ({
        ...deps,
        limit: l
      }))
    )

export const createVocabularyDependenciesWithOptions = (
  ...options: Option[]
): E.Either<VocabularyDependenciesError, Deps> =>
  options.reduce(
    (acc: E.Either<VocabularyDependenciesError, Deps>, cur: Option) => pipe(acc, E.chain(cur)),
    E.right(Object.create(null))
  )
