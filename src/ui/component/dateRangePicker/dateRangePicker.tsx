import { type FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { DayPickerProps } from '@/ui/component/dayPicker/dayPicker'
import { DatePicker } from '@/ui/component/datePicker/datePicker'
import './dateRangePicker.scss'

export type DateRange = {
  from?: Date
  to?: Date
}

type DateRangePickerProps = Omit<DayPickerProps, 'title' | 'onSelect' | 'selected'> & {
  onSelect: (dateRange: DateRange) => void
  selected: DateRange
}

export const DateRangePicker: FC<DateRangePickerProps> = ({
  onSelect,
  selected,
  ...dayPickerProps
}) => {
  const { t } = useTranslation('common')

  const handleSelectFrom = useCallback(
    (date?: Date) => {
      onSelect({ ...selected, from: date })
    },
    [onSelect, selected]
  )

  const handleSelectTo = useCallback(
    (date?: Date) => {
      onSelect({ ...selected, to: date })
    },
    [onSelect, selected]
  )

  return (
    <div className="okp4-dataverse-portal-date-range-picker-main">
      <DatePicker
        {...dayPickerProps}
        onSelect={handleSelectFrom}
        selected={selected.from}
        title={t('from')}
        type="rangeFrom"
      />
      <DatePicker
        {...dayPickerProps}
        onSelect={handleSelectTo}
        selected={selected.to}
        title={t('to')}
        type="rangeTo"
      />
    </div>
  )
}
