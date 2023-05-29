import type { FC } from 'react'
import { useState, useCallback } from 'react'
import classNames from 'classnames'
import * as RCollapsible from '@radix-ui/react-collapsible'
import type { IconName } from '@/ui/component/icon/icon'
import { Icon } from '@/ui/component/icon/icon'
import type { AssertSubset } from '@/util/type'
import './collapsible.scss'

type CollapsibleProps = {
  children: JSX.Element
  triggerElement: JSX.Element
  open?: boolean
  triggerClassName?: string
  chevronIconName?: AssertSubset<IconName, 'chevron' | 'chevron-sharp'>
}

export const Collapsible: FC<CollapsibleProps> = ({
  open = false,
  children,
  triggerElement,
  triggerClassName,
  chevronIconName
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(open)

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setIsOpen(isOpen)
  }, [])

  return (
    <RCollapsible.Root onOpenChange={handleOpenChange} open={isOpen}>
      <RCollapsible.Trigger
        className={classNames('okp4-dataverse-portal-collapsible-trigger-button', triggerClassName)}
      >
        {triggerElement}
        {chevronIconName && (
          <div
            className={classNames('okp4-dataverse-portal-collapsible-trigger-chevron', {
              flipped: isOpen
            })}
          >
            <Icon name={chevronIconName} />
          </div>
        )}
      </RCollapsible.Trigger>
      <RCollapsible.Content className="okp4-dataverse-portal-collapsible-content">
        {children}
      </RCollapsible.Content>
    </RCollapsible.Root>
  )
}
