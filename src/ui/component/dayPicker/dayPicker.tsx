import { type FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { DateRange, DateInterval, DateAfter, DateBefore, DayOfWeek } from 'react-day-picker'
import { DayPicker as RDayPicker } from 'react-day-picker'
import { addDays, isAfter, subDays, isSameDay } from 'date-fns'
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
  disabledDates?: Array<Date | DateInterval | DateRange | DateBefore | DateAfter | DayOfWeek>
}

// eslint-disable-next-line max-lines-per-function
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
  showOutsideDays = true,
  disabledDates = []
}) => {
  const { i18n } = useTranslation()
  const locale = i18n.language

  const getLocaleFromLocaleString = useMemo(() => localeMap.get(locale) ?? enUS, [locale])

  const disabledDays = useMemo(() => {
    const startOfFromYear = new Date(fromYear, 0, 1)
    const endOfToYear = new Date(toYear, 11, 31)

    switch (type) {
      case 'rangeFrom':
        return toDate ? [{ after: toDate, before: endOfToYear }] : []
      case 'rangeTo':
        return fromDate ? [{ after: startOfFromYear, before: fromDate }] : []
      case 'single':
        return disabledDates
    }
  }, [type, fromDate, toDate, fromYear, toYear, disabledDates])

  const middleRange = useMemo(() => {
    if (!fromDate || !toDate || !isAfter(subDays(toDate, 1), fromDate)) {
      return []
    }

    const middleFrom = addDays(fromDate, 1)
    const middleTo = subDays(toDate, 1)
    return [{ from: middleFrom, to: middleTo }]
  }, [fromDate, toDate])

  const startRange = useMemo(() => {
    if (!fromDate || !toDate || isSameDay(fromDate, toDate)) {
      return []
    }

    return [fromDate]
  }, [fromDate, toDate])

  const endRange = useMemo(() => {
    if (!fromDate || !toDate || isSameDay(fromDate, toDate)) {
      return []
    }

    return [toDate]
  }, [fromDate, toDate])

  const rangeEndpoint = useMemo(() => {
    switch (type) {
      case 'rangeFrom':
        return toDate ? [toDate] : []
      case 'rangeTo':
        return fromDate ? [fromDate] : []
      case 'single':
        return []
    }
  }, [fromDate, toDate, type])

  return (
    <div className="okp4-dataverse-portal-day-picker-main">
      {title && <h2 className="okp4-dataverse-portal-day-picker-title">{title}</h2>}
      <RDayPicker
        ISOWeek={isoWeek}
        captionLayout="dropdown"
        defaultMonth={selected}
        disabled={disabledDays}
        fromYear={fromYear}
        locale={getLocaleFromLocaleString}
        mode="single"
        modifiers={{ middleRange, startRange, endRange, rangeEndpoint }}
        modifiersClassNames={{
          middleRange: 'rdp-day_range_middle',
          startRange: 'rdp-day_range_start',
          endRange: 'rdp-day_range_end',
          rangeEndpoint: 'rdp-day_selected'
        }}
        onSelect={onSelect}
        selected={selected}
        showOutsideDays={showOutsideDays}
        toYear={toYear}
      />
    </div>
  )
}
