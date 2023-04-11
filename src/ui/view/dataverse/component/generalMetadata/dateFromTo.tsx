import { useTranslation } from 'react-i18next'
import { pipe } from 'fp-ts/function'
import { fold, fromNullable } from 'fp-ts/Option'

type DateFromToProps = {
  startISODate?: string
  endISODate?: string
}

const formatDateSpan = (label: JSX.Element, date: string): JSX.Element => (
  <span>
    {label}&nbsp;{date}
  </span>
)

export const DateFromTo = ({ startISODate, endISODate }: DateFromToProps): JSX.Element => {
  const { t: generalMetadataT } = useTranslation('generalMetadata')
  const { t: commonT } = useTranslation('common')
  const From = <b>{commonT('from')}</b>
  const To = <b>{commonT('to')}</b>

  return pipe(
    fromNullable(startISODate),
    fold(
      () =>
        pipe(
          fromNullable(endISODate),
          fold(
            () => <span>{generalMetadataT('generalMetadata.invalidDate')}</span>,
            endDate => formatDateSpan(To, endDate)
          )
        ),
      startDate =>
        pipe(
          fromNullable(endISODate),
          fold(
            () => formatDateSpan(From, startDate),
            endDate => (
              <>
                {formatDateSpan(From, startDate)}
                {formatDateSpan(To, endDate)}
              </>
            )
          )
        )
    )
  )
}
