import dataverse_en from './dataverse_en.json'
import dataverse_fr from './dataverse_fr.json'
import dataverse_de from './dataverse_de.json'
import type { I18nResource } from '@/ui/i18n/utils'
import { loadTranslations } from '@/ui/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'dataverse', resource: dataverse_en },
  { lng: 'fr', namespace: 'dataverse', resource: dataverse_fr },
  { lng: 'de', namespace: 'dataverse', resource: dataverse_de }
]

loadTranslations(i18nTranslations)
