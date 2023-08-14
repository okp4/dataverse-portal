import { useState } from 'react'
import type { FC } from 'react'
import classNames from 'classnames'
import * as RPopover from '@radix-ui/react-popover'
import type { IconName } from '@/ui/component/icon/icon'
import { Icon } from '@/ui/component/icon/icon'
import './popover.scss'

type PopoverProps = Omit<RPopover.PopoverContentProps, 'content'> & {
  content: JSX.Element
  trigger: JSX.Element
  open?: boolean
  contentClassName?: string
  triggerClassName?: string
  triggerIconName?: IconName
}

export const Popover: FC<PopoverProps> = ({
  open = false,
  content,
  trigger,
  contentClassName,
  triggerClassName,
  triggerIconName,
  ...contentProps
}) => {
  const [isOpen, setIsOpen] = useState(open)

  return (
    <RPopover.Root onOpenChange={setIsOpen} open={isOpen}>
      <RPopover.Trigger
        className={classNames('okp4-dataverse-portal-popover-trigger-button', triggerClassName)}
      >
        {trigger}
        {triggerIconName && (
          <div
            className={classNames('okp4-dataverse-portal-popover-trigger-icon', {
              flipped: isOpen
            })}
          >
            <Icon name={triggerIconName} />
          </div>
        )}
      </RPopover.Trigger>
      <RPopover.Content
        {...contentProps}
        className={classNames('okp4-dataverse-portal-popover-content', contentClassName)}
      >
        {content}
      </RPopover.Content>
    </RPopover.Root>
  )
}
