import { useEffect, useRef, useState } from 'react'
import type { FC } from 'react'
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
  const [triggerInitWidth, setTriggerInitWidth] = useState<number>(0)
  const [isOpen, setIsOpen] = useState(open)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const triggerWidth = triggerRef.current?.clientWidth
    triggerWidth && setTriggerInitWidth(triggerWidth)
  }, [])

  return (
    <RCollapsible.Root className={rootClassName} onOpenChange={setIsOpen} open={isOpen}>
      <RCollapsible.Trigger
        className={classNames('okp4-dataverse-portal-collapsible-trigger-button', triggerClassName)}
        ref={triggerRef}
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
        style={{
          // Copying the behaviour of the Radix-ui collapsible, for the slide animations
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ['--okp4-collapsible-trigger-initial-width' as any]: `${triggerInitWidth}px`
        }}
      >
        {content}
      </RCollapsible.Content>
    </RCollapsible.Root>
  )
}
