import error_en from './error_en.json'
import error_fr from './error_fr.json'
import error_de from './error_de.json'
import type { I18nResource } from '@/ui/i18n/utils'
import { loadTranslations } from '@/ui/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'error', resource: error_en },
  { lng: 'fr', namespace: 'error', resource: error_fr },
  { lng: 'de', namespace: 'error', resource: error_de }
]

loadTranslations(i18nTranslations)
