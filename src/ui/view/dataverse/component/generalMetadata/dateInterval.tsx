import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import {
  convertToLocalizedDateIfISODateTime,
  validateISODateRange
} from '@/util/isoDateTime/isoDateTime'
import { activeLanguageWithDefault } from '@/ui/languages/languages'

const FormattedDateSpan: FC<{
  label: 'from' | 'to'
  localizedDate: string
}> = ({ localizedDate, label }) => {
  const { t } = useTranslation('common')
  return (
    <span>
      {t(label)}&nbsp;
      {localizedDate}
    </span>
  )
}
const InvalidDateFallback: FC = () => {
  const { t } = useTranslation('generalMetadata')
  return <span>{t('generalMetadata.invalidDate')}</span>
}

const LocalizedDates: FC<{
  localizedStartDate: E.Either<Error, string>
  localizedEndDate: E.Either<Error, string>
}> = ({ localizedStartDate, localizedEndDate }) =>
  pipe(
    localizedStartDate,
    E.fold(
      () =>
        pipe(
          localizedEndDate,
          E.fold(
            () => <InvalidDateFallback />,
            localizedEndDate => <FormattedDateSpan label="to" localizedDate={localizedEndDate} />
          )
        ),
      localizedStartDate =>
        pipe(
          localizedEndDate,
          E.fold(
            () => <FormattedDateSpan label="from" localizedDate={localizedStartDate} />,
            localizedEndDate => (
              <>
                <FormattedDateSpan label="from" localizedDate={localizedStartDate} />
                <FormattedDateSpan label="to" localizedDate={localizedEndDate} />
              </>
            )
          )
        )
    )
  )

type DateIntervalProps = {
  startDate: string
  endDate: string
}

export const DateInterval: FC<DateIntervalProps> = ({ startDate, endDate }) => {
  const lng = activeLanguageWithDefault().lng
  const localizedStartDate = convertToLocalizedDateIfISODateTime(startDate, lng)
  const localizedEndDate = convertToLocalizedDateIfISODateTime(endDate, lng)

  return pipe(
    validateISODateRange(startDate, endDate),
    E.fold(
      () => <InvalidDateFallback />,
      () => (
        <LocalizedDates
          localizedEndDate={localizedEndDate}
          localizedStartDate={localizedStartDate}
        />
      )
    )
  )
}
