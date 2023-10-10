/* eslint-disable @typescript-eslint/no-unused-vars */
import type { StoreApi } from 'zustand'
import * as TE from 'fp-ts/TaskEither'
import * as MetadataDomain from '../domain'
import type { AuditMetadataItem, GeneralMetadataItem } from '../query'
import { type MetadataItem } from '../entity'
import { type Deps } from '../command'
import { type NetworkError, NetworkUnspecifiedError } from '@/shared/error/network'
import { SerializationError } from '@/shared/error/serialize'
// eslint-disable-next-line import/no-restricted-paths
import { metadataSparqlGateway } from '../../../infra/metadata/sparql/sparqlGateway'

const deps: Deps = {
  metadataPort: metadataSparqlGateway,
  language: 'en'
}

type GatewayResult = TE.TaskEither<SerializationError | NetworkError, MetadataItem[]>

type MetadataState = {
  auditMetadata: AuditMetadataItem[]
  generalMetadata: GeneralMetadataItem[]
  isLoading: boolean
}

type Data1 = {
  preloadedState?: MetadataDomain.Options
  expectedState: MetadataState
}

type Data2 = {
  preloadedState?: MetadataDomain.Options
  dataverseItemId: string
  mockGatewayResult: GatewayResult
  expectedState: MetadataState
  error?: Error
}

const defaultState: MetadataState = {
  auditMetadata: [],
  generalMetadata: [],
  isLoading: false
}

const preloadedStateWithAuditMetadata1: MetadataDomain.Options = {
  initialState: {
    data: {
      data: [{ category: 'auditMetadata', property: 'createdBy', value: 'Okp4' }],
      isLoading: false
    }
  }
}

const stateWithAuditMetadata1: MetadataState = {
  auditMetadata: [{ property: 'createdBy', value: 'Okp4' }],
  generalMetadata: [],
  isLoading: false
}

const preloadedStateWithGeneralMetadata1: MetadataDomain.Options = {
  initialState: {
    data: {
      data: [{ category: 'generalMetadata', property: 'tags', value: ['tag1', 'tag2'] }],
      isLoading: false
    }
  }
}

const stateWithGeneralMetadata1: MetadataState = {
  auditMetadata: [],
  generalMetadata: [{ property: 'tags', value: ['tag1', 'tag2'] }],
  isLoading: false
}

const preloadedStateWithLoading1: MetadataDomain.Options = {
  initialState: {
    data: {
      data: [],
      isLoading: true
    }
  }
}

const stateWithLoading1: MetadataState = {
  auditMetadata: [],
  generalMetadata: [],
  isLoading: true
}

const gatewayResult1 = TE.right([])

const gatewayResult2 = TE.right([
  {
    category: 'generalMetadata',
    property: 'title',
    value: 'Toulouse Weather'
  },
  {
    category: 'generalMetadata',
    property: 'description',
    value: 'Weather data about the Pink City'
  },
  {
    category: 'auditMetadata',
    property: 'createdBy',
    value: 'Okp4'
  }
])

const gatewayResult3 = TE.right([
  {
    category: 'generalMetadata',
    property: 'topic',
    value: 'blockchain'
  },
  {
    category: 'generalMetadata',
    property: 'format',
    value: 'Shapefile'
  },
  {
    category: 'auditMetadata',
    property: 'lastModifiedBy',
    value: 'Okp4'
  }
])

const gatewayErrorResult1 = TE.left(NetworkUnspecifiedError('Network crashed'))
const gatewayErrorResult2 = TE.left(SerializationError('Serialization failed'))

const stateWithGeneralAndAuditMetadata1: MetadataState = {
  auditMetadata: [{ property: 'createdBy', value: 'Okp4' }],
  generalMetadata: [
    { property: 'title', value: 'Toulouse Weather' },
    { property: 'description', value: 'Weather data about the Pink City' }
  ],
  isLoading: false
}

const stateWithGeneralAndAuditMetadata2: MetadataState = {
  auditMetadata: [{ property: 'lastModifiedBy', value: 'Okp4' }],
  generalMetadata: [
    { property: 'topic', value: 'blockchain' },
    { property: 'format', value: 'Shapefile' }
  ],
  isLoading: false
}
const initStore = (initialState?: MetadataDomain.Options): StoreApi<MetadataDomain.DomainAPI> =>
  MetadataDomain.storeFactory(initialState)

// eslint-disable-next-line max-lines-per-function
describe(`Retrieve metadata from a dataverve item by its ID`, () => {
  describe.each`
    preloadedState                        | expectedState
    ${undefined}                          | ${defaultState}
    ${preloadedStateWithAuditMetadata1}   | ${stateWithAuditMetadata1}
    ${preloadedStateWithGeneralMetadata1} | ${stateWithGeneralMetadata1}
    ${preloadedStateWithLoading1}         | ${stateWithLoading1}
  `('Given a preloaded state <$preloadedState>', ({ preloadedState, expectedState }: Data1) => {
    describe(`when initializing state`, () => {
      const store = initStore(preloadedState)

      test(`then expect state to be ${JSON.stringify(expectedState)}`, () => {
        const currentState: MetadataState = {
          auditMetadata: store.getState().auditMetadata()(),
          generalMetadata: store.getState().generalMetadata()(),
          isLoading: store.getState().isLoading()()
        }
        expect(currentState).toStrictEqual(expectedState)
      })
    })
  })

  describe.each`
    preloadedState                       | dataverseItemId | mockGatewayResult      | expectedState                        | error
    ${undefined}                         | ${''}           | ${gatewayResult1}      | ${defaultState}                      | ${undefined}
    ${undefined}                         | ${'id1'}        | ${gatewayResult2}      | ${stateWithGeneralAndAuditMetadata1} | ${undefined}
    ${stateWithGeneralAndAuditMetadata1} | ${'id1'}        | ${gatewayResult3}      | ${stateWithGeneralAndAuditMetadata2} | ${undefined}
    ${stateWithGeneralAndAuditMetadata1} | ${'id1'}        | ${gatewayResult3}      | ${stateWithGeneralAndAuditMetadata2} | ${undefined}
    ${undefined}                         | ${'id1'}        | ${gatewayErrorResult1} | ${defaultState}                      | ${NetworkUnspecifiedError('Network crashed')}
    ${undefined}                         | ${'id1'}        | ${gatewayErrorResult2} | ${defaultState}                      | ${SerializationError('Serialization failed')}
  `(
    'Given a preloaded state <$preloadedState> and a dataverse item id <$dataverseItemId> with this context dependency <$deps>',
    ({ preloadedState, dataverseItemId, mockGatewayResult, expectedState, error }: Data2) => {
      describe(`When calling retrieveDataverseItemMetadata command `, () => {
        afterEach(() => {
          jest.restoreAllMocks()
        })

        const store = initStore(preloadedState)

        test(`then expect current state to be ${JSON.stringify(expectedState)}`, async () => {
          const spiedMetadataGateway = jest.spyOn(metadataSparqlGateway, 'retrieveMetadata')
          spiedMetadataGateway.mockReturnValue(mockGatewayResult)

          const metadataRetrievalResult = await store
            .getState()
            .retrieveDataverseItemMetadata(dataverseItemId)(deps)()

          const currentState: MetadataState = {
            auditMetadata: store.getState().auditMetadata()(),
            generalMetadata: store.getState().generalMetadata()(),
            isLoading: store.getState().isLoading()()
          }

          if (error) {
            expect(metadataRetrievalResult).toEqualLeft(error)
          } else {
            expect(metadataRetrievalResult).toBeRight()
          }

          expect(spiedMetadataGateway).toHaveBeenCalled()
          expect(currentState).toStrictEqual(expectedState)
        })
      })
    }
  )
})
