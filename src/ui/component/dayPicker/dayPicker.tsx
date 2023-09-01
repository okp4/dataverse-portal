import { useCallback, type FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { SelectSingleEventHandler } from 'react-day-picker'
import { DayPicker as RDayPicker } from 'react-day-picker'
import { enUS, fr, de } from 'date-fns/locale'
import { Button } from '@/ui/component/button/button'
import 'react-day-picker/dist/style.css'
import './dayPicker.scss'
import './i18n/index'

const localeMap = new Map([
  ['en', enUS],
  ['fr', fr],
  ['de', de]
])

type DayPickerProps = {
  onSelect: SelectSingleEventHandler
  fromYear: number
  toYear: number
  fromDate?: Date
  toDate?: Date
  selected?: Date
  title?: string
  onConfirm?: () => void
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
  onConfirm
}) => {
  const locale = useTranslation().i18n.language
  const { t } = useTranslation('dayPicker')

  const getLocaleFromLocaleString = useMemo(() => localeMap.get(locale) ?? enUS, [locale])

  const handleRemoveDate = useCallback(
    (event?: React.MouseEvent<HTMLButtonElement>) => {
      if (!selected) return

      onSelect(undefined, selected, {}, event as React.MouseEvent<HTMLButtonElement>)
    },
    [onSelect, selected]
  )

  return (
    <div className="okp4-dataverse-portal-day-picker-main">
      {title && <h2 className="okp4-dataverse-portal-day-picker-title">{title}</h2>}
      <RDayPicker
        ISOWeek
        captionLayout="dropdown"
        fromDate={fromDate}
        fromYear={fromYear}
        locale={getLocaleFromLocaleString}
        mode="single"
        onSelect={onSelect}
        selected={selected}
        showOutsideDays
        toDate={toDate}
        toYear={toYear}
      />
      <div className="okp4-dataverse-portal-day-picker-footer">
        <Button
          className="okp4-dataverse-portal-day-picker-button"
          disabled={!selected}
          label={t('removeDate')}
          onClick={handleRemoveDate}
          size="small"
          variant="outlined-secondary"
        />
        {onConfirm && (
          <Button
            className="okp4-dataverse-portal-day-picker-button"
            disabled={!selected}
            label={t('selectDate')}
            onClick={onConfirm}
            size="small"
          />
        )}
      </div>
    </div>
  )
}
