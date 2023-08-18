import type { FC } from 'react'
import { Popover } from '@/ui/component/popover/popover'
import './dropDown.scss'

export type DropDownProps = {
  field: JSX.Element
  options: JSX.Element
}

export const DropDown: FC<DropDownProps> = ({ field, options }) => {
  return (
    <div className="okp4-dataverse-portal-dropdown-main">
      <Popover
        align="start"
        content={options}
        contentClassName="okp4-dataverse-portal-dropdown-content"
        sideOffset={8}
        trigger={<div className="okp4-dataverse-portal-dropdown-field">{field}</div>}
        triggerClassName="okp4-dataverse-portal-dropdown-trigger"
        triggerIconName="chevron-sharp"
      />
    </div>
  )
}
