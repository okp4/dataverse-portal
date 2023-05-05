import { loadTranslations } from '@/ui/i18n/utils'
import type { I18nResource } from '@/ui/i18n/utils'
import notification_en from './notification_en.json'
import notification_fr from './notification_fr.json'
import notification_de from './notification_de.json'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'notification', resource: notification_en },
  { lng: 'fr', namespace: 'notification', resource: notification_fr },
  { lng: 'de', namespace: 'notification', resource: notification_de }
]

loadTranslations(i18nTranslations)
