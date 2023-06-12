import filters_en from './filters_en.json'
import filters_fr from './filters_fr.json'
import filters_de from './filters_de.json'
import type { I18nResource } from '@/ui/i18n/utils'
import { loadTranslations } from '@/ui/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'filters', resource: filters_en },
  { lng: 'fr', namespace: 'filters', resource: filters_fr },
  { lng: 'de', namespace: 'filters', resource: filters_de }
]

loadTranslations(i18nTranslations)
