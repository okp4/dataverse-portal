import type { IOOption } from 'fp-ts/lib/IOOption'

export type VocabularyDescriptorType = 'license' | 'topic' | 'media-type' | 'area'

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
