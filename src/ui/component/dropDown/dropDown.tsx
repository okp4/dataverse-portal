import { useCallback, type FC, useState } from 'react'
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
  const [open, setOpen] = useState(false)

  const handleOpenChange = useCallback(() => {
    setOpen(state => !state)
  }, [])

  return (
    <div className="okp4-dataverse-portal-dropdown-main">
      <Popover
        align="start"
        content={content}
        contentClassName={classNames('okp4-dataverse-portal-dropdown-content', contentClassName)}
        onOpenChange={handleOpenChange}
        open={open}
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
