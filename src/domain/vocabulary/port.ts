import type { HTTPNetworkError, NetworkUnspecifiedError } from '@/shared/error/network'
import type { SerializationError } from '@/shared/error/serialize'
import type { TaskEither } from 'fp-ts/TaskEither'
import type { VocabularyElement } from './entity'

export type VocabularyType = 'license' | 'topic' | 'media-type' | 'area'

export type RetrieveVocabularyResult = { data: VocabularyElement[]; query: { hasNext: boolean } }

export type RetrieveVocabularyError =
  | HTTPNetworkError
  | NetworkUnspecifiedError
  | SerializationError

export type VocabularyPort = {
  retrieveVocabulary: (
    type: VocabularyType,
    language: string,
    limit: number,
    offset: number
  ) => TaskEither<RetrieveVocabularyError, RetrieveVocabularyResult>
}
