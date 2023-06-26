import unsupportedFeature_en from './unsupportedFeature_en.json'
import unsupportedFeature_fr from './unsupportedFeature_fr.json'
import unsupportedFeature_de from './unsupportedFeature_de.json'
import type { I18nResource } from '@/ui/i18n/utils'
import { loadTranslations } from '@/ui/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'unsupportedFeature', resource: unsupportedFeature_en },
  { lng: 'fr', namespace: 'unsupportedFeature', resource: unsupportedFeature_fr },
  { lng: 'de', namespace: 'unsupportedFeature', resource: unsupportedFeature_de }
]

loadTranslations(i18nTranslations)
