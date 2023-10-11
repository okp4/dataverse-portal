import type {
  HTTPNetworkError,
  NetworkRequestAbortedError,
  NetworkUnspecifiedError
} from '@/shared/error/network'
import type { SerializationError } from '@/shared/error/serialize'
import type { TaskEither } from 'fp-ts/TaskEither'
import type { VocabularyElement } from './entity'

export type VocabularyType =
  | '<https://ontology.okp4.space/thesaurus/license>'
  | '<https://ontology.okp4.space/thesaurus/topic>'
  | '<https://ontology.okp4.space/thesaurus/media-type>'
  | '<https://ontology.okp4.space/thesaurus/area>'

export type RetrieveVocabularyResult = { data: VocabularyElement[]; query: { hasNext: boolean } }

export type RetrieveVocabularyError =
  | HTTPNetworkError
  | NetworkUnspecifiedError
  | SerializationError
  | NetworkRequestAbortedError

export type VocabularyPort = {
  retrieveVocabulary: (
    type: VocabularyType,
    language: string,
    limit: number,
    offset: number
  ) => TaskEither<RetrieveVocabularyError, RetrieveVocabularyResult>
}
