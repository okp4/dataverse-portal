import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DateRange } from '@/ui/component/dateRangePicker/dateRangePicker'
import { DateRangePicker } from '@/ui/component/dateRangePicker/dateRangePicker'
import { Filter } from '@/ui/view/dataverse/component/filters/filter'
import './dateRangeFilter.scss'

type DateRangeFilterProps = {
  filterName: string
  // filterValue: DateRange // TODO: implement once filter query is implemented
}

export const DateRangeFilter: FC<DateRangeFilterProps> = ({ filterName }) => {
  const { t } = useTranslation('common')

  const [selected, setSelected] = useState<DateRange>({
    from: undefined,
    to: undefined
  }) // TODO: lift state up once filter query is implemented

  const handleSelect = useCallback((dateRange: DateRange) => {
    setSelected(dateRange)
  }, [])

  return (
    <Filter
      content={
        <div className="okp4-dataverse-portal-date-range-filter">
          <div className="okp4-dataverse-portal-date-range-filter-titles">
            <h4 className="okp4-dataverse-portal-date-range-filter-title">{t('from')}</h4>
            <h4 className="okp4-dataverse-portal-date-range-filter-title">{t('to')}</h4>
          </div>
          <DateRangePicker
            fromDate={selected.from}
            fromYear={new Date().getFullYear() + APP_ENV.datePicker.fromYearOffset}
            onSelect={handleSelect}
            selected={selected}
            toDate={selected.to}
            toYear={new Date().getFullYear() + APP_ENV.datePicker.toYearOffset}
          />
        </div>
      }
      filterName={filterName}
    />
  )
}
