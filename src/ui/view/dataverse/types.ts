import type { IconName } from '@/ui/component/icon/icon'

export type GeneralMetadata = {
  property: string
  value: string
  iconName?: IconName
}

export type TagsMetadata = {
  property: 'tags'
  value: string[]
}

export type Metadata = GeneralMetadata | TagsMetadata
