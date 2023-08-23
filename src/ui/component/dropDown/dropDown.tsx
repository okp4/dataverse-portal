import type { FC } from 'react'
import classNames from 'classnames'
import { Popover } from '@/ui/component/popover/popover'
import './dropDown.scss'

export type DropDownProps = {
  trigger: JSX.Element
  content: JSX.Element
  triggerClassName?: string
  contentClassName?: string
}

export const DropDown: FC<DropDownProps> = ({
  trigger,
  content,
  triggerClassName,
  contentClassName
}) => {
  return (
    <div className="okp4-dataverse-portal-dropdown-main">
      <Popover
        align="start"
        content={content}
        contentClassName={classNames('okp4-dataverse-portal-dropdown-content', contentClassName)}
        sideOffset={8}
        trigger={
          <div className={classNames('okp4-dataverse-portal-dropdown-field', triggerClassName)}>
            {trigger}
          </div>
        }
        triggerClassName="okp4-dataverse-portal-dropdown-trigger"
        triggerIconName="chevron-sharp"
      />
    </div>
  )
}
