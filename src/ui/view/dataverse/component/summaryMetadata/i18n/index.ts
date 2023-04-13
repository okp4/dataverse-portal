import metadata_en from './metadata_en.json'
import metadata_fr from './metadata_fr.json'
import metadata_de from './metadata_de.json'
import { loadTranslations } from '@/ui/i18n/utils'
import type { I18nResource } from '@/ui/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'metadata', resource: metadata_en },
  { lng: 'fr', namespace: 'metadata', resource: metadata_fr },
  { lng: 'de', namespace: 'metadata', resource: metadata_de }
]

loadTranslations(i18nTranslations)
