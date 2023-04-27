import { loadTranslations } from '@/ui/i18n/utils'
import type { I18nResource } from '@/ui/i18n/utils'
import notifications_en from './notifications_en.json'
import notifications_fr from './notifications_fr.json'
import notifications_de from './notifications_de.json'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'notifications', resource: notifications_en },
  { lng: 'fr', namespace: 'notifications', resource: notifications_fr },
  { lng: 'de', namespace: 'notifications', resource: notifications_de }
]

loadTranslations(i18nTranslations)
