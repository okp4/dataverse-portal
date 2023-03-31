import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import type { Lazy } from 'fp-ts/function'
import { pipe } from 'fp-ts/function'
import { isCurrentLanguage } from '@/ui/i18n/utils'

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

export const activeLanguage = (): O.Option<Language> =>
  pipe(
    languages,
    A.findFirst(({ lng }) => isCurrentLanguage(lng))
  )

export const activeLanguageWithDefault: Lazy<Language> = () =>
  pipe(
    activeLanguage(),
    O.getOrElse(() => fallbackLanguage)
  )
