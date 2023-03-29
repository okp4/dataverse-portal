import generalMetadata_en from './generalMetadata_en.json'
import generalMetadata_de from './generalMetadata_de.json'
import generalMetadata_fr from './generalMetadata_fr.json'
import type { I18nResource } from '@/i18n/utils'
import { loadTranslations } from '@/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'general-metadata', resource: generalMetadata_en },
  { lng: 'fr', namespace: 'general-metadata', resource: generalMetadata_fr },
  { lng: 'de', namespace: 'general-metadata', resource: generalMetadata_de }
]

loadTranslations(i18nTranslations)
