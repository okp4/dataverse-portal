import { useTranslation } from 'react-i18next'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import {
  convertToLocalizedDateIfISODateTime,
  validateISODateRange
} from '@/util/isoDateTime/isoDateTime'
import { activeLanguageWithDefault } from '@/ui/languages/languages'

const FormattedDateSpan = ({
  localizedDate,
  label
}: {
  label: 'from' | 'to'
  localizedDate: string
}): JSX.Element => {
  const { t } = useTranslation('common')
  return (
    <span>
      {t(label)}&nbsp;
      {localizedDate}
    </span>
  )
}
const InvalidDateFallback = (): JSX.Element => {
  const { t } = useTranslation('generalMetadata')
  return <span>{t('generalMetadata.invalidDate')}</span>
}

type DateIntervalProps = {
  startDate: string
  endDate: string
}

export const DateInterval = ({ startDate, endDate }: DateIntervalProps): JSX.Element => {
  const lng = activeLanguageWithDefault().lng
  const localizedStartDate = convertToLocalizedDateIfISODateTime(startDate, lng)
  const localizedEndDate = convertToLocalizedDateIfISODateTime(endDate, lng)

  return pipe(
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
            localizedEndDate =>
              pipe(
                validateISODateRange(startDate, endDate),
                E.fold(
                  () => <InvalidDateFallback />,
                  () => (
                    <>
                      <FormattedDateSpan label="from" localizedDate={localizedStartDate} />
                      <FormattedDateSpan label="to" localizedDate={localizedEndDate} />
                    </>
                  )
                )
              )
          )
        )
    )
  )
}
