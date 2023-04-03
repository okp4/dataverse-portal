// useLocalizedYearIfISODateTime.ts
import { useCallback, useMemo } from 'react'
import { activeLanguageWithDefault } from '@/ui/languages/languages'
import { convertToLocalizedYearIfISODateTime } from '@/util/isoDateTime/isoDateTime'
import { pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/Either'
import { useTranslation } from 'react-i18next'

export const useLocalizedYearIfISODateTime = (fallback: string): ((value: string) => string) => {
  const { lng } = activeLanguageWithDefault()
  const { i18n } = useTranslation()
  const resources = useMemo(() => i18n.options.resources ?? {}, [i18n.options.resources])

  const handleLocalizedYearOrError = useCallback(
    (fallback: string) =>
      E.fold(
        (error: Error) => {
          console.error(error.message)
          return fallback
        },
        (localizedYear: string) => localizedYear
      ),
    []
  )

  const convertValueToLocalizedYearIfISODateTime = useCallback(
    (value: string) =>
      pipe(
        convertToLocalizedYearIfISODateTime(value, lng, resources),
        handleLocalizedYearOrError(fallback)
      ),
    [handleLocalizedYearOrError, lng, fallback, resources]
  )

  return convertValueToLocalizedYearIfISODateTime
}
