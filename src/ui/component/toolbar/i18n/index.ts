import toolbar_en from './toolbar_en.json'
import toolbar_de from './toolbar_de.json'
import toolbar_fr from './toolbar_fr.json'
import type { I18nResource } from '@/ui/i18n/utils'
import { loadTranslations } from '@/ui/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'toolbar', resource: toolbar_en },
  { lng: 'fr', namespace: 'toolbar', resource: toolbar_fr },
  { lng: 'de', namespace: 'toolbar', resource: toolbar_de }
]

loadTranslations(i18nTranslations)
