import { useTranslation } from 'react-i18next'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import {
  convertToLocalizedDateIfISODateTime,
  validateISODateRange
} from '@/util/isoDateTime/isoDateTime'
import { activeLanguageWithDefault } from '@/ui/languages/languages'

const FormatDateSpan = ({
  localizedDate,
  label
}: {
  label: 'from' | 'to'
  localizedDate: string
}): JSX.Element => {
  const { t } = useTranslation('common')
  return (
    <span>
      <b>
        {t(label)}
        {t('colon')}
      </b>
      {localizedDate}
    </span>
  )
}
const InvalidDateFallback = (): JSX.Element => {
  const { t } = useTranslation('generalMetadata')
  return <span>{t('generalMetadata.invalidDate')}</span>
}

type DateFromToProps = {
  fromDateString: string
  toDateString: string
}

export const DateFromTo = ({ fromDateString, toDateString }: DateFromToProps): JSX.Element => {
  const lng = activeLanguageWithDefault().lng
  const fromLocalizedDateEither = convertToLocalizedDateIfISODateTime(fromDateString, lng)
  const toLocalizedDateEither = convertToLocalizedDateIfISODateTime(toDateString, lng)

  return pipe(
    fromLocalizedDateEither,
    E.fold(
      () =>
        pipe(
          toLocalizedDateEither,
          E.fold(
            () => <InvalidDateFallback />,
            toLocalizedDate => <FormatDateSpan label="to" localizedDate={toLocalizedDate} />
          )
        ),
      fromLocalizedDate =>
        pipe(
          toLocalizedDateEither,
          E.fold(
            () => <FormatDateSpan label="from" localizedDate={fromLocalizedDate} />,
            toLocalizedDate =>
              pipe(
                validateISODateRange(fromDateString, toDateString),
                E.fold(
                  () => <InvalidDateFallback />,
                  () => (
                    <>
                      <FormatDateSpan label="from" localizedDate={fromLocalizedDate} />
                      <FormatDateSpan label="to" localizedDate={toLocalizedDate} />
                    </>
                  )
                )
              )
          )
        )
    )
  )
}
