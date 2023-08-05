import type { ReaderTaskEither } from 'fp-ts/ReaderTaskEither'
import type {
  HTTPNetworkError,
  NetworkRequestAbortedError,
  NetworkUnspecifiedError
} from '@/shared/error/network'
import type { SerializationError } from '@/shared/error/serialize'
import type { RetrieveVocabularyDependencies } from './helper/dependencies'

export type VocabularyType =
  | '<https://ontology.okp4.space/thesaurus/license>'
  | '<https://ontology.okp4.space/thesaurus/topic>'
  | '<https://ontology.okp4.space/thesaurus/media-type>'
  | '<https://ontology.okp4.space/thesaurus/area>'

export type RetrieveVocabularyError =
  | HTTPNetworkError
  | NetworkUnspecifiedError
  | SerializationError
  | NetworkRequestAbortedError

export type Deps = RetrieveVocabularyDependencies

export type Command = {
  retrieveVocabularyByType: (
    type: VocabularyType
  ) => ReaderTaskEither<Deps, RetrieveVocabularyError, void>
}
