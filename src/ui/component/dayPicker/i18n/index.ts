import dayPicker_en from './dayPicker_en.json'
import dayPicker_de from './dayPicker_de.json'
import dayPicker_fr from './dayPicker_fr.json'
import type { I18nResource } from '@/ui/i18n/utils'
import { loadTranslations } from '@/ui/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'dayPicker', resource: dayPicker_en },
  { lng: 'fr', namespace: 'dayPicker', resource: dayPicker_fr },
  { lng: 'de', namespace: 'dayPicker', resource: dayPicker_de }
]

loadTranslations(i18nTranslations)
