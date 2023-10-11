import * as E from 'fp-ts/Either'
import * as S from 'fp-ts/string'
import * as P from 'fp-ts/Predicate'
import * as N from 'fp-ts/number'
import * as A from 'fp-ts/Array'
import * as ORD from 'fp-ts/Ord'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import type { Show } from 'fp-ts/lib/Show'
import type { VocabularyPort } from '../port'
import type { Deps, RawDeps } from '../command'
import { buildDeps } from '../command'

type TransientDeps = Partial<RawDeps>

type Option = (deps: TransientDeps) => E.Either<VocabularyDependenciesError, TransientDeps>

export const InvalidValueError = (propertyName: keyof TransientDeps, reason: string) =>
  ({
    _tag: 'invalid-value',
    propertyName,
    reason
  } as const)

/**
 *  Error when the value given as argument is invalid, whatever the reason
 */
export type InvalidValueError = ReturnType<typeof InvalidValueError>

export const MandatoryDependencyError = (missingPropertyName: keyof TransientDeps) =>
  ({
    _tag: 'mandatory-dependency',
    missingPropertyName
  } as const)

/**
 *  Error when one oor more properties are missing in the created Dependencies
 */
export type MandatoryDependencyError = ReturnType<typeof MandatoryDependencyError>

export type VocabularyDependenciesError = InvalidValueError | MandatoryDependencyError

export const ShowVocabularyDependenciesError: Show<VocabularyDependenciesError> = {
  show: (error: VocabularyDependenciesError): string => {
    switch (error._tag) {
      case 'invalid-value': {
        return `Error ${error._tag}: The given parameter <${error.propertyName}> is invalid regarding the following reason: ${error.reason}`
      }
      case 'mandatory-dependency': {
        return `Error ${error._tag}: The ${error.missingPropertyName} property is missing, so we cannot build dependencies.`
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
      E.fromPredicate(P.not(S.isEmpty), () => MandatoryDependencyError('language')),
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
      E.fromPredicate(
        x => ORD.geq(N.Ord)(x, 0),
        () =>
          InvalidValueError(
            'limit',
            'Limit cannot be a negative value. Please provide a value non-strictly greater than 0'
          )
      ),
      E.map(l => ({
        ...deps,
        limit: l
      }))
    )

const validateDeps = (deps: TransientDeps): E.Either<VocabularyDependenciesError, Deps> =>
  pipe(
    deps,
    O.fromPredicate(depsIsRequiredTransientDeps),
    O.map(buildDeps),
    E.fromOption(() => {
      const rawDepsKeys: Array<keyof RawDeps> = ['language', 'limit', 'vocabularyGateway']
      const r = pipe(rawDepsKeys, A.difference(S.Eq)(Object.keys(deps))) as Array<keyof RawDeps>
      return MandatoryDependencyError(r[0])
    })
  )

export const createVocabularyDependenciesWithOptions = (
  ...options: Option[]
): E.Either<VocabularyDependenciesError, Deps> =>
  pipe(
    options,
    A.reduce(
      E.right({}),
      (acc: E.Either<VocabularyDependenciesError, TransientDeps>, cur: Option) =>
        pipe(acc, E.chain(cur))
    ),
    E.chain(validateDeps)
  )
