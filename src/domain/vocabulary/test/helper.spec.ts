import * as E from 'fp-ts/Either'
import type { RetrieveVocabularyDependencies } from '../helper/dependencies'
import {
  MandatoryDependenciesError,
  LanguageEmptyError,
  NegativeLimitError,
  createVocabularyDependenciesWithOptions,
  withLanguage,
  withLimit,
  withVocabularyGateway
} from '../helper/dependencies'
import { pipe } from 'fp-ts/lib/function'
import type { VocabularyPort } from '../port'
// eslint-disable-next-line import/no-restricted-paths
import { sparqlGateway } from '@/infra/vocabulary/sparql/sparqlGateway'

type Data = {
  vocabularyGateway?: VocabularyPort
  language?: string
  limit?: number
  expectedDeps: RetrieveVocabularyDependencies
  expectedError?: Error
}

describe('Considering the createDepsWithOptions() function', () => {
  // Expected Deps
  const emptyDeps = Object.create(null)
  const expectedDeps1: RetrieveVocabularyDependencies = {
    _tag: 'retrieve-vocabulary-deps',
    language: 'en',
    limit: 20,
    vocabularyGateway: sparqlGateway
  }
  describe.each`
    vocabularyGateway | language     | limit        | expectedDeps     | expectedError
    ${undefined}      | ${undefined} | ${undefined} | ${emptyDeps}     | ${MandatoryDependenciesError({})}
    ${sparqlGateway}  | ${''}        | ${20}        | ${emptyDeps}     | ${LanguageEmptyError()}
    ${sparqlGateway}  | ${'en'}      | ${-1}        | ${emptyDeps}     | ${NegativeLimitError(-1)}
    ${sparqlGateway}  | ${'en'}      | ${20}        | ${expectedDeps1} | ${undefined}
    ${sparqlGateway}  | ${undefined} | ${undefined} | ${emptyDeps}     | ${MandatoryDependenciesError({ vocabularyGateway: sparqlGateway })}
    ${undefined}      | ${'en'}      | ${undefined} | ${emptyDeps}     | ${MandatoryDependenciesError({ language: 'en' })}
    ${undefined}      | ${undefined} | ${20}        | ${emptyDeps}     | ${MandatoryDependenciesError({ limit: 20 })}
  `(
    'Given a vocabularyGateway <$vocabularyGateway>, a language <$language> and a limit <$limit>',
    ({ vocabularyGateway, language, limit, expectedDeps, expectedError }: Data) => {
      describe('When building deps', () => {
        const options = []
        vocabularyGateway !== undefined && options.push(withVocabularyGateway(vocabularyGateway))
        language !== undefined && options.push(withLanguage(language))
        limit !== undefined && options.push(withLimit(limit))
        const deps = createVocabularyDependenciesWithOptions(...options)

        test(`Then, expect vocabulary dependencies to strict equal ${JSON.stringify(
          expectedDeps
        )}`, () => {
          expect(deps).toBeEither()
          pipe(
            deps,
            E.match(
              e => expect(e).toStrictEqual(expectedError),
              d => expect(d).toStrictEqual(expectedDeps)
            )
          )
        })
      })
    }
  )
})
