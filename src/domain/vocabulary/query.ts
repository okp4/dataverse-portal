import type { IOOption } from 'fp-ts/lib/IOOption'

export type VocabularyDescriptorType =
  | '<https://ontology.okp4.space/thesaurus/license>'
  | '<https://ontology.okp4.space/thesaurus/topic>'
  | '<https://ontology.okp4.space/thesaurus/media-type>'
  | '<https://ontology.okp4.space/thesaurus/area>'

export type URI = string

export type VocabularyDescriptor = {
  id: URI
  label: string
}

export type VocabularyDescriptorByType = {
  isLoading: boolean
  hasNext: boolean
  data: VocabularyDescriptor[]
}

export type Query = {
  vocabularyByType: (type: VocabularyDescriptorType) => IOOption<VocabularyDescriptorByType>
}
