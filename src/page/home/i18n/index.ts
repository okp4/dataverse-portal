import home_en from './home_en.json'
import home_fr from './home_fr.json'
import home_de from './home_de.json'
import type { I18nResource } from '@/i18n/utils'
import { loadTranslations } from '@/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'home', resource: home_en },
  { lng: 'fr', namespace: 'home', resource: home_fr },
  { lng: 'de', namespace: 'home', resource: home_de }
]

loadTranslations(i18nTranslations)
