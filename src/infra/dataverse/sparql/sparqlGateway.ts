/* eslint-disable max-lines-per-function */
import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/function'
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
    const buildContainsExpression = (filter: DataverseElementType): string =>
      `contains(str(?type), "${filter}" )`

    const buildQueryFilter = (index: number, acc: string, cur: DataverseElementType): string =>
      index === 0 ? buildContainsExpression(cur) : `${acc} || ${buildContainsExpression(cur)}`

    const byTypeFilter = (f: DataverseElementType[]): string =>
      A.reduceWithIndex('', buildQueryFilter)(f)

    const query = `
      PREFIX core: <https://ontology.okp4.space/core/>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX serviceMetadata: <https://ontology.okp4.space/metadata/service/>
      PREFIX datasetMetadata: <https://ontology.okp4.space/metadata/dataset/>
      PREFIX dataspaceMetadata: <https://ontology.okp4.space/metadata/dataspace/>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      SELECT ?id ?metadata ?title ?type ?publisher ?topic ?prefLabel
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
        ${filters.byType === 'all' ? '' : `FILTER ( ${byTypeFilter(filters.byType)} )`}
        ?id rdf:type ?type .
        ?type rdf:type owl:Class .
        ?metadata core:describes ?id .
        OPTIONAL { 
          ?metadata core:hasTitle ?title .
          FILTER langMatches(lang(?title),'${language}')
        }
        OPTIONAL { 
          ?metadata core:hasTitle ?title .
        }
        ?metadata core:hasPublisher ?publisher .
        OPTIONAL { 
          ?topic skos:prefLabel ?prefLabel .
          FILTER langMatches(lang(?prefLabel),'${language}')
        }
        OPTIONAL { 
          ?topic skos:prefLabel ?prefLabel .
        }
      }
      ORDER BY asc(str(?title))
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
