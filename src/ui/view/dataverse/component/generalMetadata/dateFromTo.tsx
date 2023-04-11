import { useTranslation } from 'react-i18next'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import {
  convertToLocalizedDateIfISODateTime,
  validateISODateRange
} from '@/util/isoDateTime/isoDateTime'
import { activeLanguageWithDefault } from '@/ui/languages/languages'

const formatDateSpan = (label: JSX.Element, localizedDate: string): JSX.Element => (
  <span>
    {label}&nbsp;{localizedDate}
  </span>
)

type DateFromToProps = {
  fromDateString: string
  toDateString: string
}

export const DateFromTo = ({ fromDateString, toDateString }: DateFromToProps): JSX.Element => {
  const { t: generalMetadataT } = useTranslation('generalMetadata')
  const { t: commonT } = useTranslation('common')
  const lng = activeLanguageWithDefault().lng
  const From = <b>{commonT('from')}</b>
  const To = <b>{commonT('to')}</b>
  const InvalidDateFallback = <span>{generalMetadataT('generalMetadata.invalidDate')}</span>
  const fromLocalizedDateEither = convertToLocalizedDateIfISODateTime(fromDateString, lng)
  const toLocalizedDateEither = convertToLocalizedDateIfISODateTime(toDateString, lng)

  return pipe(
    fromLocalizedDateEither,
    E.fold(
      () =>
        pipe(
          toLocalizedDateEither,
          E.fold(
            () => InvalidDateFallback,
            toLocalizedDate => formatDateSpan(To, toLocalizedDate)
          )
        ),
      fromLocalizedDate =>
        pipe(
          toLocalizedDateEither,
          E.fold(
            () => formatDateSpan(From, fromLocalizedDate),
            toLocalizedDate =>
              pipe(
                validateISODateRange(fromDateString, toDateString),
                E.fold(
                  () => InvalidDateFallback,
                  () => (
                    <>
                      {formatDateSpan(From, fromLocalizedDate)}
                      {formatDateSpan(To, toLocalizedDate)}
                    </>
                  )
                )
              )
          )
        )
    )
  )
}
