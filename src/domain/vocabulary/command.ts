import type { ReaderTaskEither } from 'fp-ts/ReaderTaskEither'
import type { VocabularyPort } from './port'
import type {
  HTTPNetworkError,
  NetworkRequestAbortedError,
  NetworkUnspecifiedError
} from '@/shared/error/network'
import type { SerializationError } from '@/shared/error/serialize'

export type Deps = {
  vocabularyGateway: VocabularyPort
  language: string
  limit: number
}

export type VocabularyType = 'license' | 'topic' | 'media-type' | 'area'

export type RetrieveVocabularyError =
  | HTTPNetworkError
  | NetworkUnspecifiedError
  | SerializationError
  | NetworkRequestAbortedError

export type Command = {
  retrieveVocabularyByType: (
    type: VocabularyType
  ) => ReaderTaskEither<Deps, RetrieveVocabularyError, void>
}
