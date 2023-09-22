import type { MetadataPort } from '@/domain/metadata/port'
import { isError } from '@/util/util'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import type { SparqlResult } from './dto'
import type {
  AuditMetadataProperty,
  MetadataItem,
  MetadataProperty
} from '@/domain/metadata/entity'

const auditMetadata = ['createdBy', 'createdOn', 'lastModifiedBy', 'updatedOn'] as const
type AuditMetadata = (typeof auditMetadata)[number]
const isAuditMetadata = (metadata: string): metadata is AuditMetadataProperty =>
  auditMetadata.includes(metadata as AuditMetadata)

export const metadataSparqlGateway: MetadataPort = {
  // eslint-disable-next-line max-lines-per-function
  retrieveMetadata: (
    dataverseItemId: string,
    language: string
  ): TE.TaskEither<Error, MetadataItem[]> => {
    const query = `
    PREFIX core: <https://ontology.okp4.space/core/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX dataset: <https://ontology.okp4.space/dataverse/dataset/>
    PREFIX service: <https://ontology.okp4.space/dataverse/service/>
    PREFIX zone: <https://ontology.okp4.space/dataverse/zone/>
    
    SELECT 
       ?publisher ?createdBy ?updatedOn ?createdOn ?lastModifiedBy ?image ?creator ?startDate ?endDate ?tags
        (SAMPLE(COALESCE(?titleUserLg, ?titleEnLg, ?titleFirstLg)) AS ?title) 
        (SAMPLE(COALESCE(?descriptionUserLg, ?descriptionEnLg, ?descriptionFirstLg)) AS ?description) 
        (SAMPLE(COALESCE(?licenseUserLg, ?licenseEnLg, ?licenseFirstLg)) AS ?license)
        (SAMPLE(COALESCE(?spatialCoverageUserLg, ?spatialCoverageEnLg, ?spatialCoverageFirstLg)) AS ?spatialCoverage)
        (SAMPLE(COALESCE(?topicUserLg, ?topicEnLg, ?topicFirstLg)) AS ?topic)
        (SAMPLE(COALESCE(?formatUserLg, ?formatEnLg, ?formatFirstLg)) AS ?format)
        (SAMPLE(COALESCE(?categoryUserLg, ?categoryEnLg, ?categoryFirstLg)) AS ?category)

    WHERE {
      {
        ?generalMetadataID a <https://ontology.okp4.space/metadata/dataset/GeneralMetadata> ;
                         core:describes dataset:${dataverseItemId} .
    
        ?auditMetadataID a <https://ontology.okp4.space/metadata/AuditMetadata> ;
                       core:describes dataset:${dataverseItemId} .
      } UNION {
        ?generalMetadataID a <https://ontology.okp4.space/metadata/service/GeneralMetadata> ;
                         core:describes service:${dataverseItemId} .
    
        ?auditMetadataID a <https://ontology.okp4.space/metadata/AuditMetadata> ;
                       core:describes service:${dataverseItemId} .
      } UNION {
        ?generalMetadataID a <https://ontology.okp4.space/metadata/zone/GeneralMetadata> ;
                         core:describes zone:${dataverseItemId} .
    
        ?auditMetadataID a <https://ontology.okp4.space/metadata/AuditMetadata> ;
                       core:describes zone:${dataverseItemId} .
      }            

      OPTIONAL { 
        ?generalMetadataID core:hasTitle ?titleFirstLg .
        OPTIONAL {
          ?generalMetadataID core:hasTitle ?titleUserLg .
          FILTER langMatches(lang(?titleUserLg),'${language}') .
        }
        OPTIONAL {
          ?generalMetadataID core:hasTitle ?titleEnLg .
          FILTER langMatches(lang(?titleEnLg), 'en')
        }
      }

      OPTIONAL { 
        ?generalMetadataID core:hasDescription ?descriptionFirstLg .
        OPTIONAL {
          ?generalMetadataID core:hasDescription ?descriptionUserLg .
          FILTER langMatches(lang(?descriptionUserLg),'${language}') .
        }
        OPTIONAL {
          ?generalMetadataID core:hasDescription ?descriptionEnLg .
          FILTER langMatches(lang(?descriptionEnLg), 'en')
        }
      }
  
      {
        SELECT ?generalMetadataID (GROUP_CONCAT(DISTINCT ?tag; separator=", ") AS ?tags)
        WHERE {
          OPTIONAL {
            ?generalMetadataID core:hasTag ?tag .
          }
        }
        GROUP BY ?generalMetadataID
      }

      OPTIONAL { ?generalMetadataID core:hasPublisher ?publisher . }
      OPTIONAL { ?auditMetadataID core:createdBy ?createdBy . }
      OPTIONAL { ?auditMetadataID core:updatedOn ?updatedOn . }
      OPTIONAL { ?auditMetadataID core:createdOn ?createdOn . }
      OPTIONAL { ?auditMetadataID core:lastModifiedBy ?lastModifiedBy . }
      OPTIONAL { ?generalMetadataID core:hasImage ?image . }

      OPTIONAL { 
        ?generalMetadataID core:hasLicense ?licenseResource .
        ?licenseResource skos:prefLabel ?licenseFirstLg .
        OPTIONAL {
          ?licenseResource skos:prefLabel ?licenseUserLg .
          FILTER langMatches(lang(?licenseUserLg), '${language}') .
        }
        OPTIONAL {
          ?licenseResource skos:prefLabel ?licenseEnLg .
          FILTER langMatches(lang(?licenseEnLg),'en') .
        }
      }

      OPTIONAL { 
        ?generalMetadataID core:hasSpatialCoverage ?areaResource .
        ?areaResource skos:prefLabel ?spatialCoverageFirstLg .
        OPTIONAL {
          ?areaResource skos:prefLabel ?spatialCoverageUserLg .
          FILTER langMatches(lang(?spatialCoverageUserLg),'${language}') .
        }
        OPTIONAL {
          ?areaResource skos:prefLabel ?spatialCoverageEnLg .
          FILTER langMatches(lang(?spatialCoverageEnLg),'en') .
        }
      }

      OPTIONAL { 
        ?generalMetadataID core:hasTopic ?topicResource .
        ?topicResource skos:prefLabel ?topicFirstLg . 
        OPTIONAL {
          ?topicResource skos:prefLabel ?topicUserLg . 
          FILTER langMatches(lang(?topicUserLg),'${language}') .
        }
        OPTIONAL {
          ?topicResource skos:prefLabel ?topicEnLg . 
          FILTER langMatches(lang(?topicEnLg),'en') .
        }
      }
      
      OPTIONAL { ?generalMetadataID core:hasCreator ?creator . }

    
      OPTIONAL { 
        ?generalMetadataID core:hasFormat ?formatResource .
        ?formatResource skos:prefLabel ?formatFirstLg . 
        OPTIONAL {
          ?formatResource skos:prefLabel ?formatUserLg . 
          FILTER langMatches(lang(?formatUserLg),'${language}') .
        }
        OPTIONAL {
          ?formatResource skos:prefLabel ?formatEnLg . 
          FILTER langMatches(lang(?formatEnLg),'en') .
        }
      }

      OPTIONAL { 
        ?generalMetadataID core:hasTemporalCoverage ?temporalCoverage .
        OPTIONAL {  ?temporalCoverage core:hasStartDate ?startDate . }
        OPTIONAL {  ?temporalCoverage core:hasEndDate ?endDate . }
      }

      OPTIONAL { 
        ?generalMetadataID core:hasCategory ?categoryResource . 
        OPTIONAL {
          ?categoryResource skos:prefLabel ?categoryFirstLg .
        }
        OPTIONAL {
          ?categoryResource skos:prefLabel ?categoryUserLg .
          FILTER langMatches(lang(?categoryUserLg),'${language}') .
        }
        OPTIONAL {
          ?categoryResource skos:prefLabel ?categoryEnLg .
          FILTER langMatches(lang(?categoryEnLg),'en') .
        }
      }
    }

    GROUP BY ?publisher ?createdBy ?updatedOn ?createdOn ?lastModifiedBy ?image ?creator ?startDate ?endDate ?tags
    `

    const request: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accept: 'application/sparql-results+json'
      },
      body: `query=${encodeURIComponent(query)}`
    }

    const fetchMetadata = (): TE.TaskEither<Error, Response> =>
      TE.tryCatch(
        async () => {
          const resp = await fetch(APP_ENV.sparql['endpoint'], request)
          if (!resp.ok) {
            throw new Error(
              `Oops.. A ${resp.status} HTTP error occurred with the following message: ${resp.statusText} `
            )
          }
          return resp
        },
        error =>
          isError(error)
            ? error
            : new Error(`Oops.. Something went wrong fetching ontology: ${JSON.stringify(error)}`)
      )

    const serializeResponse = (response: Response): TE.TaskEither<Error, SparqlResult> =>
      TE.tryCatch(
        async () => response.json(),
        err =>
          isError(err)
            ? err
            : new Error(
                `Oops.. Something went wrong serializing sparql response: ${JSON.stringify(err)}`
              )
      )

    const mapDtoToEntity = (dto: SparqlResult): MetadataItem[] =>
      Object.entries(dto.results.bindings[0]).map(([key, value]) => ({
        category: isAuditMetadata(key) ? 'auditMetadata' : 'generalMetadata',
        property: key as MetadataProperty,
        value: value.value
      }))

    return pipe(fetchMetadata(), TE.chain(serializeResponse), TE.map(mapDtoToEntity))
  }
}
