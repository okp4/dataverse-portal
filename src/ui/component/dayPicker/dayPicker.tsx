import { type FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DayPicker as RDayPicker } from 'react-day-picker'
import { enUS, fr, de } from 'date-fns/locale'
import 'react-day-picker/dist/style.css'
import './dayPicker.scss'

const localeMap = new Map([
  ['en', enUS],
  ['fr', fr],
  ['de', de]
])

export type DayPickerProps = {
  onSelect: (date?: Date) => void
  fromYear: number
  toYear: number
  fromDate?: Date
  toDate?: Date
  selected?: Date
  title?: string
  type?: 'single' | 'rangeFrom' | 'rangeTo'
  isoWeek?: boolean
  showOutsideDays?: boolean
}

export const DayPicker: FC<DayPickerProps> = ({
  onSelect,
  fromYear,
  toYear,
  fromDate,
  toDate,
  selected,
  title,
  type = 'single',
  isoWeek = true,
  showOutsideDays = true
}) => {
  const { i18n } = useTranslation()
  const locale = i18n.language

  const getLocaleFromLocaleString = useMemo(() => localeMap.get(locale) ?? enUS, [locale])

  const disabledDays = useMemo(() => {
    const defaultDisabledDays = [
      { before: new Date(fromYear, 0, 1) },
      { after: new Date(toYear, 11, 31) }
    ]
    switch (type) {
      case 'rangeFrom':
        return toDate ? [{ before: toYear, after: toDate }] : defaultDisabledDays
      case 'rangeTo':
        return fromDate ? [{ before: fromDate, after: fromYear }] : defaultDisabledDays
      case 'single':
        return defaultDisabledDays
    }
  }, [type, fromDate, toDate, fromYear, toYear])

  return (
    <div className="okp4-dataverse-portal-day-picker-main">
      {title && <h2 className="okp4-dataverse-portal-day-picker-title">{title}</h2>}
      <RDayPicker
        ISOWeek={isoWeek}
        captionLayout="dropdown"
        disabled={disabledDays}
        fromYear={fromYear}
        locale={getLocaleFromLocaleString}
        mode="single"
        onSelect={onSelect}
        selected={selected}
        showOutsideDays={showOutsideDays}
        toYear={toYear}
      />
    </div>
  )
}
