import type { FC } from 'react'
import { Collapsible } from '@/ui/component/collapsible/collapsible'
import './filter.scss'

type FilterLabelProps = {
  label: string
}

export const FilterLabel: FC<FilterLabelProps> = ({ label }) => (
  <h3 className="okp4-dataverse-portal-dataverse-filter-label">{label}</h3>
)

type FilterProps = {
  filterName: string
  content: JSX.Element
}

export const Filter: FC<FilterProps> = ({ filterName, content }) => (
  <div className="okp4-dataverse-portal-dataverse-filter-main">
    <Collapsible
      content={<div className="okp4-dataverse-portal-dataverse-filter">{content}</div>}
      iconName="chevron"
      open
      trigger={<FilterLabel label={filterName} />}
      triggerClassName="okp4-dataverse-portal-dataverse-filter-trigger"
    />
  </div>
)
