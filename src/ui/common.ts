import type { ColorVariant, DataverseItem } from './types'

export const renderItemTypeColor = (type: DataverseItem): ColorVariant => {
  switch (type) {
    case 'service':
      return 'blue-500'
    case 'zone':
      return 'turquoise-500'
    case 'dataset':
      return 'primary-variant-4'
  }
}
