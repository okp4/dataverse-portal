import sidebar_en from './sidebar_en.json'
import type { I18nResource } from '@/i18n/utils'
import { loadTranslations } from '@/i18n/utils'

const i18nTranslations: I18nResource[] = [{ lng: 'en', namespace: 'sidebar', resource: sidebar_en }]

loadTranslations(i18nTranslations)
