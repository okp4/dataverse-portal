import tagsField_en from './tagsField_en.json'
import tagsField_fr from './tagsField_fr.json'
import tagsField_de from './tagsField_de.json'
import type { I18nResource } from '@/ui/i18n/utils'
import { loadTranslations } from '@/ui/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'tagsField', resource: tagsField_en },
  { lng: 'fr', namespace: 'tagsField', resource: tagsField_fr },
  { lng: 'de', namespace: 'tagsField', resource: tagsField_de }
]

loadTranslations(i18nTranslations)
