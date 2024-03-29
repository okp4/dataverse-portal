/* eslint-disable max-lines-per-function */
import * as VocabularyDomain from '@/domain/vocabulary/domain'
import type { StoreApi } from 'zustand'
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import type { RetrieveVocabularyError, VocabularyType } from '../command'
import { NetworkUnspecifiedError } from '@/shared/error/network'
import type { VocabularyDescriptorByType } from '../query'
import {
  createVocabularyDependenciesWithOptions,
  withVocabularyGateway,
  withLanguage,
  withLimit
} from '../helper/dependencies'
// eslint-disable-next-line import/no-restricted-paths
import { sparqlGateway } from '@/infra/vocabulary/sparql/sparqlGateway'
import type { RetrieveVocabularyResult } from '../port'
import type { Vocabulary } from '../entity'
import { vocabularyTypes } from '../entity'

type InitialProps = Readonly<{
  store: StoreApi<VocabularyDomain.DomainAPI>
}>

type Data = {
  preloadedState: VocabularyDomain.Options
  vocabularyType?: VocabularyType
  gatewayResult?: TE.TaskEither<RetrieveVocabularyError, RetrieveVocabularyResult>
  expectedVocabularyByType: VocabularyDescriptorByType
  error?: RetrieveVocabularyError
}

const initStore = (initialState?: VocabularyDomain.Options): InitialProps => {
  const store = VocabularyDomain.storeFactory(initialState)
  return { store }
}

describe('Retrieve vocabulary by type from a thesaurus', () => {
  const spy = jest.spyOn(sparqlGateway, 'retrieveVocabulary')

  afterEach(() => {
    jest.clearAllMocks()
  })

  // Preloaded state
  const defaultVocabulary: Vocabulary = {
    isLoading: false,
    hasNext: false,
    data: []
  }
  const preloadedState: VocabularyDomain.Options = {
    initialState: {
      data: {
        byType: {
          '<https://ontology.okp4.space/thesaurus/area>': {
            isLoading: true,
            hasNext: true,
            data: [{ id: '1', label: 'foo' }]
          },
          ...vocabularyTypes
            .filter(r => r !== '<https://ontology.okp4.space/thesaurus/area>')
            .reduce((acc, cur) => ({ ...acc, [cur]: defaultVocabulary }), Object.create(null))
        }
      }
    }
  }

  // Commands inputs
  const vocabularyType1: VocabularyType = '<https://ontology.okp4.space/thesaurus/area>'

  // Queries
  const expectedVocabularyByType1: VocabularyDescriptorByType = {
    isLoading: false,
    hasNext: false,
    data: []
  }

  const expectedVocabularyByType2: VocabularyDescriptorByType = {
    isLoading: true,
    hasNext: true,
    data: [{ id: '1', label: 'foo' }]
  }

  const expectedVocabularyByType3: VocabularyDescriptorByType = {
    isLoading: false,
    hasNext: true,
    data: [{ id: '1', label: 'foo' }]
  }

  const expectedVocabularyByType4: VocabularyDescriptorByType = {
    isLoading: false,
    hasNext: false,
    data: [{ id: '1', label: 'foo' }]
  }

  // Gateway mocks
  const gatewayResult1 = TE.right({ data: [], query: { hasNext: false } })
  const gatewayResult2 = TE.left(NetworkUnspecifiedError('foo'))
  const gatewayResult3 = TE.right({ data: [{ id: '1', label: 'foo' }], query: { hasNext: true } })

  describe.each`
    preloadedState    | vocabularyType     | gatewayResult     | expectedVocabularyByType             | error
    ${undefined}      | ${undefined}       | ${undefined}      | ${O.some(expectedVocabularyByType1)} | ${undefined}
    ${preloadedState} | ${undefined}       | ${undefined}      | ${O.some(expectedVocabularyByType2)} | ${undefined}
    ${preloadedState} | ${vocabularyType1} | ${gatewayResult1} | ${O.some(expectedVocabularyByType4)} | ${undefined}
    ${undefined}      | ${vocabularyType1} | ${gatewayResult2} | ${O.some(expectedVocabularyByType1)} | ${NetworkUnspecifiedError('foo')}
    ${undefined}      | ${vocabularyType1} | ${gatewayResult3} | ${O.some(expectedVocabularyByType3)} | ${undefined}
  `(
    `Given a vocabulary type <$vocabularyType>`,
    ({
      preloadedState,
      vocabularyType,
      gatewayResult,
      expectedVocabularyByType,
      error
    }: Data): void => {
      const { store } = initStore(preloadedState)
      const deps = pipe(
        createVocabularyDependenciesWithOptions(
          withVocabularyGateway(sparqlGateway),
          withLanguage('en'),
          withLimit(20)
        ),
        E.getOrElseW(() => undefined)
      )

      describe('When retrieving vocabulary', () => {
        test(`Then, expect vocabulary by type to be ${JSON.stringify(
          expectedVocabularyByType
        )}`, async () => {
          gatewayResult && spy.mockReturnValue(gatewayResult)

          const result =
            deps &&
            vocabularyType &&
            (await store.getState().retrieveVocabularyByType(vocabularyType)(deps)())

          expect(store.getState().vocabularyByType(vocabularyType1)()).toStrictEqual(
            expectedVocabularyByType
          )
          result && expect(result).toBeEither()
          if (error) {
            expect(result).toBeLeft()
            expect(result).toEqualLeft(error)
          } else {
            result && expect(result).toBeRight()
          }
        })
      })
    }
  )
})
