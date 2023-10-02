import { useMemo, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/ui/component/icon/icon'
import './dateInput.scss'
import type { PartialDateFormatOptions } from '@/util/date/date'
import { formatDateToPattern } from '@/util/date/date'

const datePattern = {
  day: 'DD',
  month: 'MM',
  year: 'YY'
}

const dateFormatOptions: PartialDateFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
}

type DateInputProps = {
  date?: Date
}

export const DateInput: FC<DateInputProps> = ({ date }) => {
  const { i18n } = useTranslation()
  const locale = i18n.language

  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(locale, dateFormatOptions), [locale])

  const datePlaceholder = useMemo(
    () => formatDateToPattern(datePattern, dateFormatOptions, locale),
    [locale]
  )

  return (
    <div className="okp4-dataverse-portal-date-input-main">
      <input
        className="okp4-dataverse-portal-date-input"
        placeholder={datePlaceholder}
        readOnly
        value={date ? dateFormatter.format(date) : ''}
      />
      <Icon name="calendar" />
    </div>
  )
}
