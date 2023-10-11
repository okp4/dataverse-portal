/* eslint-disable max-lines-per-function */
import * as E from 'fp-ts/Either'
import {
  MandatoryDependencyError,
  InvalidValueError,
  createVocabularyDependenciesWithOptions,
  withLanguage,
  withLimit,
  withVocabularyGateway
} from '../helper/dependencies'
import { pipe } from 'fp-ts/lib/function'
import type { VocabularyPort } from '../port'
// eslint-disable-next-line import/no-restricted-paths
import { sparqlGateway } from '@/infra/vocabulary/sparql/sparqlGateway'
import type { Deps } from '../command'

type Data = {
  vocabularyGateway?: VocabularyPort
  language?: string
  limit?: number
  expectedDeps: Omit<Deps, '_opaque'>
  expectedError?: Error
}

describe('Considering the createDepsWithOptions() function', () => {
  // Expected Deps
  const emptyDeps = Object.create(null)
  const expectedDeps1: Omit<Deps, '_opaque'> = {
    language: 'en',
    limit: 20,
    vocabularyGateway: sparqlGateway
  }
  const expectedDeps2: Omit<Deps, '_opaque'> = {
    language: 'en',
    limit: 0,
    vocabularyGateway: sparqlGateway
  }

  describe.each`
    vocabularyGateway | language     | limit        | expectedDeps     | expectedError
    ${undefined}      | ${undefined} | ${undefined} | ${emptyDeps}     | ${MandatoryDependencyError('language')}
    ${sparqlGateway}  | ${'en'}      | ${-1}        | ${emptyDeps}     | ${InvalidValueError('limit', 'Limit cannot be a negative value. Please provide a value non-strictly greater than 0')}
    ${sparqlGateway}  | ${'en'}      | ${20}        | ${expectedDeps1} | ${undefined}
    ${sparqlGateway}  | ${'en'}      | ${0}         | ${expectedDeps2} | ${undefined}
    ${sparqlGateway}  | ${undefined} | ${undefined} | ${emptyDeps}     | ${MandatoryDependencyError('language')}
    ${undefined}      | ${'en'}      | ${undefined} | ${emptyDeps}     | ${MandatoryDependencyError('limit')}
    ${undefined}      | ${'en'}      | ${20}        | ${emptyDeps}     | ${MandatoryDependencyError('vocabularyGateway')}
    ${sparqlGateway}  | ${''}        | ${20}        | ${emptyDeps}     | ${MandatoryDependencyError('language')}
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
              d => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { _opaque: _, ...rest } = d
                return expect(rest).toStrictEqual(expectedDeps)
              }
            )
          )
        })
      })
    }
  )
})
