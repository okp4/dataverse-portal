import type { Deps } from '../command'
import * as E from 'fp-ts/Either'
import {
  GatewayTypeError,
  LanguageEmptyError,
  NegativeLimitError,
  createVocabularyDependenciesWithOptions,
  withLanguage,
  withLimit,
  withVocabularyGateway
} from '../helper/dependencies'
import { pipe } from 'fp-ts/lib/function'
import type { VocabularyPort } from '../port'

type Data = {
  vocabularyGateway?: VocabularyPort
  language?: string
  limit?: number
  expectedDeps: Deps
  expectedError?: Error
}

describe('Considering the createDepsWithOptions() function', () => {
  describe.each`
    vocabularyGateway                | language     | limit        | expectedDeps                                                                       | expectedError
    ${undefined}                     | ${undefined} | ${undefined} | ${Object.create(null)}                                                             | ${undefined}
    ${{ foo: 'bar' }}                | ${''}        | ${undefined} | ${Object.create(null)}                                                             | ${GatewayTypeError({ foo: 'bar' })}
    ${undefined}                     | ${''}        | ${undefined} | ${Object.create(null)}                                                             | ${LanguageEmptyError()}
    ${undefined}                     | ${''}        | ${-1}        | ${Object.create(null)}                                                             | ${LanguageEmptyError()}
    ${undefined}                     | ${undefined} | ${-1}        | ${Object.create(null)}                                                             | ${NegativeLimitError(-1)}
    ${{ retrieveVocabulary: 'foo' }} | ${'en'}      | ${20}        | ${{ language: 'en', limit: 20, vocabularyGateway: { retrieveVocabulary: 'foo' } }} | ${undefined}
    ${{ retrieveVocabulary: 'foo' }} | ${undefined} | ${undefined} | ${{ vocabularyGateway: { retrieveVocabulary: 'foo' } }}                            | ${undefined}
    ${undefined}                     | ${'en'}      | ${undefined} | ${{ language: 'en' }}                                                              | ${undefined}
    ${undefined}                     | ${undefined} | ${20}        | ${{ limit: 20 }}                                                                   | ${undefined}
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
