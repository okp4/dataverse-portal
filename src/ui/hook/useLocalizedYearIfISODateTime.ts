import { useCallback } from 'react'
import { activeLanguageWithDefault } from '@/ui/languages/languages'
import { convertToLocalizedDateIfISODateTime } from '@/util/isoDateTime/isoDateTime'
import { pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/Either'

export const useLocalizedDateIfISODateTime = (fallback: string): ((value: string) => string) => {
  const { lng } = activeLanguageWithDefault()

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
      pipe(convertToLocalizedDateIfISODateTime(value, lng), handleLocalizedYearOrError(fallback)),
    [handleLocalizedYearOrError, lng, fallback]
  )

  return convertValueToLocalizedYearIfISODateTime
}
