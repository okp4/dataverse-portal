import common_en from './common_en.json'
import common_fr from './common_fr.json'
import common_de from './common_de.json'
import { loadTranslations } from '@/i18n/utils'
import type { I18nResource } from '@/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'common', resource: common_en },
  { lng: 'fr', namespace: 'common', resource: common_fr },
  { lng: 'de', namespace: 'common', resource: common_de }
]

loadTranslations(i18nTranslations)
