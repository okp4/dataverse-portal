import pageTemplate_en from './pageTemplate_en.json'
import pageTemplate_fr from './pageTemplate_fr.json'
import pageTemplate_de from './pageTemplate_de.json'
import type { I18nResource } from '@/ui/i18n/utils'
import { loadTranslations } from '@/ui/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'pageTemplate', resource: pageTemplate_en },
  { lng: 'fr', namespace: 'pageTemplate', resource: pageTemplate_fr },
  { lng: 'de', namespace: 'pageTemplate', resource: pageTemplate_de }
]

loadTranslations(i18nTranslations)
