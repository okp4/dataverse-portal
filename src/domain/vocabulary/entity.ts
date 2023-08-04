export type URI = string

export type VocabularyType = 'license' | 'topic' | 'media-type' | 'area'

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
