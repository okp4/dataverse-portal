/* eslint-disable max-lines-per-function */
import * as A from 'fp-ts/lib/Array'
import { flow, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/TaskEither'
import type { DataverseEntity } from '@/domain/dataverse/entity'
import type {
  DataversePort,
  RetrieveDataverseQueryFilters,
  RetrieveDataverseResult
} from '@/domain/dataverse/port'
import type { SparqlBinding, SparqlResult } from './dto'

export const sparqlGateway: DataversePort = {
  retrieveDataverse: (
    language: string,
    limit: number,
    offset: number,
    filters?: RetrieveDataverseQueryFilters
  ): TE.TaskEither<Error, RetrieveDataverseResult> => {
    const query = `
      PREFIX core: <https://ontology.okp4.space/core/>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX serviceMetadata: <https://ontology.okp4.space/metadata/service/>
      PREFIX datasetMetadata: <https://ontology.okp4.space/metadata/dataset/>
      PREFIX dataspaceMetadata: <https://ontology.okp4.space/metadata/dataspace/>
      SELECT ?id ?metadata ?title ?description ?type
      WHERE {
        {
          ?id rdf:type core:Service .
          ?metadata rdf:type serviceMetadata:GeneralMetadata .
        } UNION {
          ?id rdf:type core:Dataset .
          ?metadata rdf:type datasetMetadata:GeneralMetadata .
        } UNION {          
          ?id rdf:type core:DataSpace .
          ?metadata rdf:type dataspaceMetadata:GeneralMetadata .
        }
        ${
          filters && filters.byType !== 'all'
            ? `FILTER ( contains(str(?type), "${filters.byType}" ))`
            : ''
        }
        ?id rdf:type ?type .
        ?type rdf:type owl:Class .
        ?metadata core:describes ?id .
        ?metadata core:hasTitle ?title .
        ?metadata core:hasDescription ?description .
        FILTER ( langMatches(lang(?title),'${language}') && langMatches(lang(?description),'${language}') )
      }
      LIMIT ${limit}
      OFFSET ${offset}
`

    const fetchHeaders: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${APP_ENV.sparql['credentials']}`,
        accept: 'application/sparql-results+json'
      },
      body: `query=${encodeURIComponent(query)}`
    }

    const fetchDataverse = (): TE.TaskEither<Error, Response> =>
      TE.tryCatch(
        async () => fetch(APP_ENV.sparql['endpoint'], fetchHeaders),
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
        O.fromNullable(b.id.value.split('/').at(-1)),
        O.map(a => [b, a])
      )

    const splitBindingType = ([b, a]: [SparqlBinding, string]): O.Option<
      [SparqlBinding, string, string]
    > =>
      pipe(
        O.fromNullable(b.type.value.split('/').at(-1)),
        O.map(c => [b, a, c])
      )

    const getDataverseEntityLengthOption = O.fromPredicate(
      (dataverseEntity: DataverseEntity) => dataverseEntity.length === limit
    )
    const filterDataverseEntity = (dataverseEntity: DataverseEntity): DataverseEntity =>
      pipe(
        dataverseEntity,
        getDataverseEntityLengthOption,
        O.match(
          () => dataverseEntity,
          e => A.dropRight(1)(e)
        )
      )

    const mapDtoToEntity = (dto: SparqlResult): DataverseEntity =>
      pipe(
        dto.results.bindings,
        A.filterMap(splitBindingId),
        A.filterMap(splitBindingType),
        A.map(([{ title, description }, id, type]) => {
          return {
            id,
            properties: [
              { property: 'title', value: title.value },
              {
                property: 'type',
                value: type
              },
              {
                property: 'description',
                value: description.value
              }
            ]
          }
        })
      )

    return pipe(
      fetchDataverse(),
      TE.chain(serializeResponse),
      TE.chain<Error, SparqlResult, { data: DataverseEntity; query: { hasNext: boolean } }>(
        flow(mapDtoToEntity, r =>
          TE.right({ data: filterDataverseEntity(r), query: { hasNext: r.length === limit } })
        )
      )
    )
  }
}
