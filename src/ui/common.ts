import type { ColorVariant, DataverseItem } from './types'

export const renderItemTypeColor = (type: DataverseItem): ColorVariant => {
  switch (type) {
    case 'service':
      return 'blue-500'
    case 'zone':
      return 'turquoise-700'
    case 'dataset':
      return 'turquoise-200'
  }
}
