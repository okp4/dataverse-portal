import share_data_en from './share_data_en.json'
import share_data_fr from './share_data_fr.json'
import share_data_de from './share_data_de.json'
import type { I18nResource } from '@/ui/i18n/utils'
import { loadTranslations } from '@/ui/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'shareData', resource: share_data_en },
  { lng: 'fr', namespace: 'shareData', resource: share_data_fr },
  { lng: 'de', namespace: 'shareData', resource: share_data_de }
]

loadTranslations(i18nTranslations)
