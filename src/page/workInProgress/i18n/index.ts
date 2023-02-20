import workInProgress_en from './workInProgress_en.json'
import type { I18nResource } from '@/i18n/utils'
import { loadTranslations } from '@/i18n/utils'

const i18nTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'workInProgress', resource: workInProgress_en }
]

loadTranslations(i18nTranslations)
