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
import { getURILastElement } from '@/util/util'
import { createAbortableFetch } from '@/util/fetch/fetch'
import type { SparqlBinding, SparqlResult } from './dto'
const { abortRequest, fetchWithAbort } = createAbortableFetch()

export const sparqlGateway: DataversePort = {
  retrieveDataverse: (
    language: string,
    limit: number,
    offset: number,
    filters: RetrieveDataverseQueryFilters
  ): TE.TaskEither<Error, RetrieveDataverseResult> => {
    const buildStrExpression = (filter: DataverseElementType): string => `?type = core:${filter}`

    const byTypeFilter = (filters: DataverseElementType[]): string =>
      flow(A.map(buildStrExpression), a => a.join(' || '))(filters)

    const query = `
      PREFIX core: <https://ontology.okp4.space/core/>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX serviceMetadata: <https://ontology.okp4.space/metadata/service/>
      PREFIX datasetMetadata: <https://ontology.okp4.space/metadata/dataset/>
      PREFIX dataspaceMetadata: <https://ontology.okp4.space/metadata/dataspace/>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      SELECT ?id ?metadata ?title ?type ?publisher ?topic (COALESCE(?filteredPrefLabel, ?fallbackPrefLabel) as ?prefLabel)
      WHERE {
        {
          ?id rdf:type core:Service .
          ?metadata rdf:type serviceMetadata:GeneralMetadata .
          ?metadata core:hasCategory ?topic .
        } UNION {
          ?id rdf:type core:Dataset .
          ?metadata rdf:type datasetMetadata:GeneralMetadata .
          ?metadata core:hasTopic ?topic .
        } UNION {          
          ?id rdf:type core:DataSpace .
          ?metadata rdf:type dataspaceMetadata:GeneralMetadata .
          ?metadata core:hasTopic ?topic .
        }
        ?id rdf:type ?type .
        ?type rdf:type owl:Class .
        ${filters.byType === 'all' ? '' : `FILTER ( ${byTypeFilter(filters.byType)} )`}
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

    const fetchHeaders: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accept: 'application/sparql-results+json'
      },
      body: `query=${encodeURIComponent(query)}`
    }

    const fetchDataverse = (): TE.TaskEither<Error, Response> =>
      TE.tryCatch(
        async () => {
          const resp = await fetchWithAbort(APP_ENV.sparql['endpoint'], fetchHeaders)
          if (!resp.ok) {
            throw new Error(
              `Oops.. A ${resp.status} HTTP error occurred with the following message: ${resp.statusText} `
            )
          }
          return resp
        },
        reason =>
          reason instanceof Error
            ? reason
            : new Error(`Oops.. Something went wrong fetching ontology: ${JSON.stringify(reason)}`)
      )

    const serializeResponse = (response: Response): TE.TaskEither<Error, SparqlResult> =>
      TE.tryCatch(
        async () => response.json(),
        reason =>
          reason instanceof Error
            ? reason
            : new Error(
                `Oops.. Something went wrong serializing sparql response: ${JSON.stringify(reason)}`
              )
      )

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
      fetchDataverse(),
      TE.chain(serializeResponse),
      TE.map(mapDtoToEntity),
      TE.map(r => ({
        data: A.takeLeft(limit)(r),
        query: { hasNext: r.length === limit + 1 }
      }))
    )
  },
  cancelDataverseRetrieval: (): void => abortRequest()
}
