import share_en from './share_en.json'
import share_fr from './share_fr.json'
import share_de from './share_de.json'
import type { I18nResource } from '@/ui/i18n/utils'
import { loadTranslations } from '@/ui/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'share', resource: share_en },
  { lng: 'fr', namespace: 'share', resource: share_fr },
  { lng: 'de', namespace: 'share', resource: share_de }
]

loadTranslations(i18nTranslations)
