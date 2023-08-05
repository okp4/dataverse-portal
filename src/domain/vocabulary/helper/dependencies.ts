import * as E from 'fp-ts/Either'
import * as S from 'fp-ts/string'
import * as P from 'fp-ts/Predicate'
import * as N from 'fp-ts/number'
import * as ORD from 'fp-ts/Ord'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import type { Show } from 'fp-ts/lib/Show'
import type { VocabularyPort } from '../port'

const retrieveVocabularyDependenciesTag = 'retrieve-vocabulary-deps'

type Deps = {
  _tag: typeof retrieveVocabularyDependenciesTag
  vocabularyGateway: VocabularyPort
  language: string
  limit: number
}

export type RetrieveVocabularyDependencies = Readonly<Deps>

type TransientDeps = Partial<{
  vocabularyGateway: VocabularyPort
  language: string
  limit: number
}>

type Option = (deps: TransientDeps) => E.Either<VocabularyDependenciesError, TransientDeps>

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

export const MandatoryDependenciesError = (deps: TransientDeps) =>
  ({
    _tag: 'mandatory-dependencies',
    deps
  } as const)

/**
 *  Error when one oor more properties are missing in the created Dependencies
 */
export type MandatoryDependenciesError = ReturnType<typeof MandatoryDependenciesError>

export type VocabularyDependenciesError =
  | LanguageEmptyError
  | NegativeLimitError
  | MandatoryDependenciesError

export const ShowVocabularyDependenciesError: Show<VocabularyDependenciesError> = {
  show: (error: VocabularyDependenciesError): string => {
    switch (error._tag) {
      case 'language-empty': {
        return `Error ${error._tag}: The given language parameter cannot be empty`
      }
      case 'negative-limit': {
        return `Error ${error._tag}: The given limit parameter <${error.limit}> cannot be negative`
      }
      case 'mandatory-dependencies': {
        return `Error ${
          error._tag
        }: All properties are mandatory, but received a partial object: <${JSON.stringify(
          error.deps
        )}>`
      }
    }
  }
}

const depsIsRequiredTransientDeps = (deps: TransientDeps): deps is Required<TransientDeps> =>
  'vocabularyGateway' in deps && 'limit' in deps && 'language' in deps

export const withVocabularyGateway =
  (vocabularyGateway: VocabularyPort): Option =>
  (deps: TransientDeps) =>
    E.of({
      ...deps,
      vocabularyGateway
    })

export const withLanguage =
  (lng: string): Option =>
  (deps: TransientDeps) =>
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
  (deps: TransientDeps) =>
    pipe(
      limit,
      E.fromPredicate(x => ORD.gt(N.Ord)(x, 0), NegativeLimitError),
      E.map(l => ({
        ...deps,
        limit: l
      }))
    )

const validateDeps = (
  deps: TransientDeps
): E.Either<VocabularyDependenciesError, RetrieveVocabularyDependencies> =>
  pipe(
    deps,
    O.fromPredicate(depsIsRequiredTransientDeps),
    O.map(({ vocabularyGateway, limit, language }) => ({
      _tag: retrieveVocabularyDependenciesTag as typeof retrieveVocabularyDependenciesTag,
      vocabularyGateway,
      limit,
      language
    })),

    E.fromOption(() => MandatoryDependenciesError(deps))
  )

export const createVocabularyDependenciesWithOptions = (
  ...options: Option[]
): E.Either<VocabularyDependenciesError, RetrieveVocabularyDependencies> =>
  pipe(
    options.reduce(
      (acc: E.Either<VocabularyDependenciesError, TransientDeps>, cur: Option) =>
        pipe(acc, E.chain(cur)),
      E.right({})
    ),
    E.chain(validateDeps)
  )
