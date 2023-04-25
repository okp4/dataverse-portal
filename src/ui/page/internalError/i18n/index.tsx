import internalError_en from './internalError_en.json'
import internalError_fr from './internalError_fr.json'
import internalError_de from './internalError_de.json'
import type { I18nResource } from '@/ui/i18n/utils'
import { loadTranslations } from '@/ui/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'internalError', resource: internalError_en },
  { lng: 'fr', namespace: 'internalError', resource: internalError_fr },
  { lng: 'de', namespace: 'internalError', resource: internalError_de }
]

loadTranslations(i18nTranslations)
