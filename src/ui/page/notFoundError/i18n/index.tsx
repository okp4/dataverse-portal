import notFoundError_en from './notFoundError_en.json'
import notFoundError_fr from './notFoundError_fr.json'
import notFoundError_de from './notFoundError_de.json'
import type { I18nResource } from '@/ui/i18n/utils'
import { loadTranslations } from '@/ui/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'notFoundError', resource: notFoundError_en },
  { lng: 'fr', namespace: 'notFoundError', resource: notFoundError_fr },
  { lng: 'de', namespace: 'notFoundError', resource: notFoundError_de }
]

loadTranslations(i18nTranslations)
