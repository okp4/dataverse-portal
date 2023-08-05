export type URI = string

export const vocabularyTypes = [
  '<https://ontology.okp4.space/thesaurus/license>',
  '<https://ontology.okp4.space/thesaurus/topic>',
  '<https://ontology.okp4.space/thesaurus/media-type>',
  '<https://ontology.okp4.space/thesaurus/area>'
] as const

export type VocabularyType = (typeof vocabularyTypes)[number]

export type VocabularyElement = {
  id: URI
  label: string
}

export type Vocabulary = {
  isLoading: boolean
  hasNext: boolean
  data: VocabularyElement[]
}

export type VocabularyByType = Record<VocabularyType, Vocabulary>

export type VocabularyState = {
  byType: VocabularyByType
}
