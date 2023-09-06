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

type DayPickerProps = {
  onSelect: (date?: Date) => void
  fromYear: number
  toYear: number
  fromDate?: Date
  toDate?: Date
  selected?: Date
  title?: string
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
  isoWeek = true,
  showOutsideDays = true
}) => {
  const { i18n } = useTranslation()
  const locale = i18n.language

  const getLocaleFromLocaleString = useMemo(() => localeMap.get(locale) ?? enUS, [locale])

  return (
    <div className="okp4-dataverse-portal-day-picker-main">
      {title && <h2 className="okp4-dataverse-portal-day-picker-title">{title}</h2>}
      <RDayPicker
        ISOWeek={isoWeek}
        captionLayout="dropdown"
        fromDate={fromDate}
        fromYear={fromYear}
        locale={getLocaleFromLocaleString}
        mode="single"
        onSelect={onSelect}
        selected={selected}
        showOutsideDays={showOutsideDays}
        toDate={toDate}
        toYear={toYear}
      />
    </div>
  )
}
