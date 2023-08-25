import type { FC } from 'react'
import { Popover } from '@/ui/component/popover/popover'
import './dropDown.scss'

export type DropDownProps = {
  trigger: JSX.Element
  content: JSX.Element
}

export const DropDown: FC<DropDownProps> = ({ trigger, content }) => {
  return (
    <div className="okp4-dataverse-portal-dropdown-main">
      <Popover
        align="start"
        content={content}
        contentClassName="okp4-dataverse-portal-dropdown-content"
        sideOffset={8}
        trigger={<div className="okp4-dataverse-portal-dropdown-field">{trigger}</div>}
        triggerClassName="okp4-dataverse-portal-dropdown-trigger"
        triggerIconName="chevron-sharp"
      />
    </div>
  )
}
