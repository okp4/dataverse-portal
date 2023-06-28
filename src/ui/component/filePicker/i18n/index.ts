import filePicker_en from './filePicker_en.json'
import filePicker_fr from './filePicker_fr.json'
import filePicker_de from './filePicker_de.json'
import type { I18nResource } from '@/ui/i18n/utils'
import { loadTranslations } from '@/ui/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'filePicker', resource: filePicker_en },
  { lng: 'fr', namespace: 'filePicker', resource: filePicker_fr },
  { lng: 'de', namespace: 'filePicker', resource: filePicker_de }
]

loadTranslations(i18nTranslations)
