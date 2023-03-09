import * as O from 'fp-ts/Option'
import { isCurrentLanguage } from '@/i18n/utils'

export type Lng = string

export type Language = {
  lng: Lng
  label: string
}

export const fallbackLanguage: Language = {
  lng: 'en',
  label: 'english'
}

export const languages: Language[] = [
  fallbackLanguage,
  {
    lng: 'fr',
    label: 'français'
  },
  {
    lng: 'de',
    label: 'deutsch'
  }
]

export const getActiveLanguage = (): O.Option<Language> =>
  O.fromNullable(languages.find(({ lng }) => isCurrentLanguage(lng)))
