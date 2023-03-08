import sidebar_en from './sidebar_en.json'
import sidebar_fr from './sidebar_fr.json'
import sidebar_de from './sidebar_de.json'
import type { I18nResource } from '@/i18n/utils'
import { loadTranslations } from '@/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'sidebar', resource: sidebar_en },
  { lng: 'fr', namespace: 'sidebar', resource: sidebar_fr },
  { lng: 'de', namespace: 'sidebar', resource: sidebar_de }
]

loadTranslations(i18nTranslations)
