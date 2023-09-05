import { useMemo, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/ui/component/icon/icon'
import './dateInput.scss'

type DateInputProps = {
  date?: Date
}

export const DateInput: FC<DateInputProps> = ({ date }) => {
  const { i18n } = useTranslation()
  const locale = i18n.language

  const localizedDateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' }),
    [locale]
  )

  const localizedDatePattern = useMemo(
    () =>
      localizedDateFormatter
        .formatToParts(date)
        .map(({ type, value }) => {
          switch (type) {
            case 'day':
              return 'DD'
            case 'month':
              return 'MM'
            case 'year':
              return 'YY'
            default:
              return value
          }
        })
        .join(''),
    [localizedDateFormatter, date]
  )

  return (
    <div className="okp4-dataverse-portal-date-input-main">
      <input
        className="okp4-dataverse-portal-date-input"
        placeholder={localizedDatePattern}
        readOnly
        value={date ? localizedDateFormatter.format(date) : ''}
      />
      <Icon name="calendar" />
    </div>
  )
}
