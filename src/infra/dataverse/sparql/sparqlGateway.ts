/* eslint-disable max-lines-per-function */
import * as A from 'fp-ts/Array'
import { flow, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as TE from 'fp-ts/TaskEither'
import type { DataverseElement } from '@/domain/dataverse/entity'
import type {
  DataversePort,
  RetrieveDataverseQueryFilters,
  RetrieveDataverseResult,
  DataverseElementType
} from '@/domain/dataverse/port'
import { escapeSparqlStr, getURILastElement } from '@/util/util'
import { createAbortableFetch } from '@/util/fetch/fetch'
import type { SparqlBinding, SparqlResult } from './dto'
import { fetchWithSparql, serializeFetchResponse } from '@/infra/shared/sparql.util'
import type {
  HTTPNetworkError,
  NetworkUnspecifiedError,
  NetworkRequestAbortedError
} from '@/shared/network'
import type { ResponseToJsonSerializationError } from '@/shared/serialize'
const { abortRequest } = createAbortableFetch()

export const sparqlGateway: DataversePort = {
  retrieveDataverse: (
    language: string,
    limit: number,
    offset: number,
    { byType, byProperty, byServiceCategory }: RetrieveDataverseQueryFilters
  ): TE.TaskEither<
    | HTTPNetworkError
    | NetworkRequestAbortedError
    | NetworkUnspecifiedError
    | ResponseToJsonSerializationError,
    RetrieveDataverseResult
  > => {
    const buildStrExpression = (filter: DataverseElementType): string => `?type = core:${filter}`

    const byTypeFilter = (filters: DataverseElementType[]): string =>
      flow(A.map(buildStrExpression), a => a.join(' || '))(filters)

    const byPropertyFilter = (): string =>
      pipe(
        byProperty,
        O.match(
          () => '',
          filter =>
            `FILTER ( contains(lcase(str(?${filter.property})), "${escapeSparqlStr(
              filter.value.toLowerCase()
            )}" ) )`
        )
      )

    const byServiceCategoryFilter = (): string =>
      pipe(
        byServiceCategory,
        O.map(filter => `FILTER ( ?topic = svccat:${filter} )`),
        O.getOrElse(() => '')
      )

    const query = `
      PREFIX core: <https://ontology.okp4.space/core/>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX servicemetadata: <https://ontology.okp4.space/metadata/service/>
      PREFIX datasetmetadata: <https://ontology.okp4.space/metadata/dataset/>
      PREFIX zonemetadata: <https://ontology.okp4.space/metadata/zone/>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX svccat: <https://ontology.okp4.space/thesaurus/service-category/> 
      SELECT DISTINCT ?id ?metadata ?title ?type ?publisher ?topic (COALESCE(?filteredPrefLabel, ?fallbackPrefLabel) as ?prefLabel)
      WHERE {
        {
          ?id rdf:type core:Service .
          ?metadata rdf:type servicemetadata:GeneralMetadata .
          ?metadata core:hasCategory ?topic .
        } UNION {
          ?id rdf:type core:Dataset .
          ?metadata rdf:type datasetmetadata:GeneralMetadata .
          ?metadata core:hasTopic ?topic .
        } UNION {          
          ?id rdf:type core:Zone .
          ?metadata rdf:type zonemetadata:GeneralMetadata .
          ?metadata core:hasTopic ?topic .
        }
        ${byType === 'all' ? '' : `FILTER ( ${byTypeFilter(byType)} )`}
        ${byPropertyFilter()}
        ${byServiceCategoryFilter()}
        ?id rdf:type ?type .
        ?type rdf:type owl:Class .
        ?metadata core:describes ?id .
        ?metadata core:hasTitle ?title .
        FILTER langMatches(lang(?title),'${language}')
        ?metadata core:hasPublisher ?publisher .
        OPTIONAL { 
          ?topic skos:prefLabel ?filteredPrefLabel .
          FILTER langMatches(lang(?filteredPrefLabel),'${language}')
        }
        ?topic skos:prefLabel ?fallbackPrefLabel .
      }
      ORDER BY ?title
      LIMIT ${limit + 1}
      OFFSET ${offset}
`

    const splitBindingId = (b: SparqlBinding): O.Option<[SparqlBinding, string]> =>
      pipe(
        b.id.value,
        getURILastElement,
        O.map(a => [b, a])
      )

    const splitBindingType = ([b, a]: [SparqlBinding, string]): O.Option<
      [SparqlBinding, string, string]
    > =>
      pipe(
        b.type.value,
        getURILastElement,
        O.map(c => [b, a, c])
      )

    const mapDtoToEntity = (dto: SparqlResult): DataverseElement[] =>
      pipe(
        dto.results.bindings,
        A.filterMap(splitBindingId),
        A.filterMap(splitBindingType),
        A.map(([{ title, publisher, prefLabel }, id, type]) => ({
          id,
          properties: [
            { property: 'title', value: title.value },
            {
              property: 'type',
              value: type
            },
            {
              property: 'publisher',
              value: publisher.value
            },
            {
              property: 'topic',
              value: prefLabel.value
            }
          ]
        }))
      )

    return pipe(
      query,
      fetchWithSparql,
      TE.chainW(serializeFetchResponse<SparqlResult>),
      TE.map(mapDtoToEntity),
      TE.map(r => ({
        data: A.takeLeft(limit)(r),
        query: { hasNext: r.length === limit + 1 }
      }))
    )
  },
  cancelDataverseRetrieval: (): void => abortRequest()
}
