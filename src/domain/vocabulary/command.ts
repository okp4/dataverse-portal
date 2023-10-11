import type { ReaderTaskEither } from 'fp-ts/ReaderTaskEither'
import type {
  HTTPNetworkError,
  NetworkRequestAbortedError,
  NetworkUnspecifiedError
} from '@/shared/error/network'
import type { SerializationError } from '@/shared/error/serialize'
import type { VocabularyPort } from './port'

const depsSymbol: unique symbol = Symbol()

export type RawDeps = {
  vocabularyGateway: VocabularyPort
  language: string
  limit: number
}

export type Deps = {
  _opaque: typeof depsSymbol
} & RawDeps

export const buildDeps = (input: RawDeps): Deps => ({
  _opaque: depsSymbol,
  language: input.language,
  limit: input.limit,
  vocabularyGateway: input.vocabularyGateway
})

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

export type Command = {
  retrieveVocabularyByType: (
    type: VocabularyType
  ) => ReaderTaskEither<Deps, RetrieveVocabularyError, void>
}
