/* eslint-disable max-lines-per-function */
import type {
  RetrieveVocabularyResult,
  RetrieveVocabularyError,
  VocabularyPort,
  VocabularyType
} from '@/domain/vocabulary/port'
import { fetchWithSparql, serializeFetchResponse } from '@/infra/shared/sparql.util'
import * as TE from 'fp-ts/TaskEither'
import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/lib/function'
import type { SparqlResult } from './dto'
import type { VocabularyElement } from '@/domain/vocabulary/entity'

export const sparqlGateway: VocabularyPort = {
  retrieveVocabulary: (
    type: VocabularyType,
    language: string,
    limit: number,
    offset: number
  ): TE.TaskEither<RetrieveVocabularyError, RetrieveVocabularyResult> => {
    const query = `
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
	    PREFIX thesaurus: <https://ontology.okp4.space/thesaurus/>
      SELECT ?term ?prefLabel
      WHERE {
        ?term a skos:Concept .
        ?term skos:inScheme thesaurus:${type} .
        ?term skos:prefLabel ?prefLabel .
        FILTER langMatches(lang(?prefLabel),'${language}')
      }
      LIMIT ${limit + 1}
      OFFSET ${offset}
    `

    const mapDtoToEntity = (dto: SparqlResult): VocabularyElement[] =>
      pipe(
        dto.results.bindings,
        A.map(({ term, prefLabel }) => ({
          id: term.value,
          label: prefLabel.value
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
  }
}
