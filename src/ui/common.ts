import type { ColorVariant, DataverseItem } from './types'

export const renderItemTypeColor = (type: DataverseItem): ColorVariant => {
  switch (type) {
    case 'service':
      return 'primary-color'
    case 'zone':
      return 'primary-color-variant-3'
    case 'dataset':
      return 'primary-color-variant-4'
  }
}
