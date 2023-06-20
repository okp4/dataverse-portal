import type { FC } from 'react'
import { useState } from 'react'
import classNames from 'classnames'
import * as RCollapsible from '@radix-ui/react-collapsible'
import type { IconName } from '@/ui/component/icon/icon'
import { Icon } from '@/ui/component/icon/icon'
import './collapsible.scss'

type CollapsibleProps = {
  content: JSX.Element
  trigger: JSX.Element
  open?: boolean
  contentClassName?: string
  rootClassName?: string
  triggerClassName?: string
  iconName?: IconName
}

export const Collapsible: FC<CollapsibleProps> = ({
  open = false,
  content,
  trigger,
  contentClassName,
  rootClassName,
  triggerClassName,
  iconName = 'chevron'
}) => {
  const [isOpen, setIsOpen] = useState(open)

  return (
    <RCollapsible.Root className={rootClassName} onOpenChange={setIsOpen} open={isOpen}>
      <RCollapsible.Trigger
        className={classNames('okp4-dataverse-portal-collapsible-trigger-button', triggerClassName)}
      >
        {trigger}
        <div
          className={classNames('okp4-dataverse-portal-collapsible-trigger-icon', {
            flipped: isOpen
          })}
        >
          <Icon name={iconName} />
        </div>
      </RCollapsible.Trigger>
      <RCollapsible.Content
        className={classNames('okp4-dataverse-portal-collapsible-content', contentClassName)}
      >
        {content}
      </RCollapsible.Content>
    </RCollapsible.Root>
  )
}
