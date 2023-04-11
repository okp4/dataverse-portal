import { useTranslation } from 'react-i18next'
import { pipe } from 'fp-ts/function'
import { fold, fromEither } from 'fp-ts/Option'
import { convertToLocalizedDateIfISODateTime } from '@/util/isoDateTime/isoDateTime'
import { activeLanguageWithDefault } from '@/ui/languages/languages'

const formatDateSpan = (label: JSX.Element, date: string): JSX.Element => (
  <span>
    {label}&nbsp;{date}
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

  const fromDateOption = pipe(convertToLocalizedDateIfISODateTime(fromDateString, lng), fromEither)
  const toDateOption = pipe(convertToLocalizedDateIfISODateTime(toDateString, lng), fromEither)

  return pipe(
    fromDateOption,
    fold(
      () =>
        pipe(
          toDateOption,
          fold(
            () => <span>{generalMetadataT('generalMetadata.invalidDate')}</span>,
            toDate => formatDateSpan(To, toDate)
          )
        ),
      fromDate =>
        pipe(
          toDateOption,
          fold(
            () => formatDateSpan(From, fromDate),
            toDate => (
              <>
                {formatDateSpan(From, fromDate)}
                {formatDateSpan(To, toDate)}
              </>
            )
          )
        )
    )
  )
}
