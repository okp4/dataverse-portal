import type { IconName } from '@/ui/component/icon/icon'

export type Category = 'generalMetadata' | 'auditMetadata'

export type ItemGeneralMetadata = {
  category: Category
  property: string
  value: string | string[]
  iconName?: IconName
}
