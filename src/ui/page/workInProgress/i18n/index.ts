import workInProgress_en from './workInProgress_en.json'
import workInProgress_de from './workInProgress_de.json'
import workInProgress_fr from './workInProgress_fr.json'
import type { I18nResource } from '@/ui/i18n/utils'
import { loadTranslations } from '@/ui/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'workInProgress', resource: workInProgress_en },
  { lng: 'fr', namespace: 'workInProgress', resource: workInProgress_fr },
  { lng: 'de', namespace: 'workInProgress', resource: workInProgress_de }
]

loadTranslations(i18nTranslations)
