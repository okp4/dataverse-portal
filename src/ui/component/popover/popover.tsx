import { useEffect, useRef } from 'react'
import type { FC } from 'react'
import classNames from 'classnames'
import * as RPopover from '@radix-ui/react-popover'
import type { IconName } from '@/ui/component/icon/icon'
import { Icon } from '@/ui/component/icon/icon'
import './popover.scss'

type PopoverProps = {
  content: JSX.Element
  trigger: JSX.Element
  onOpenChange?: () => void
  open?: boolean
  contentClassName?: string
  triggerClassName?: string
  triggerIconName?: IconName
  align?: 'center' | 'start' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  container?: HTMLElement
}

export const Popover: FC<PopoverProps> = ({
  open = false,
  content,
  trigger,
  contentClassName,
  triggerClassName,
  triggerIconName,
  container,
  onOpenChange,
  align = 'start',
  side = 'bottom',
  sideOffset = 8
}) => {
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    containerRef.current = container ?? document.getElementById('popover-root')
  }, [container])

  return (
    <RPopover.Root onOpenChange={onOpenChange} open={open}>
      <RPopover.Trigger
        className={classNames('okp4-dataverse-portal-popover-trigger-button', triggerClassName)}
      >
        {trigger}
        {triggerIconName && (
          <div
            className={classNames('okp4-dataverse-portal-popover-trigger-icon', {
              flipped: open
            })}
          >
            <Icon name={triggerIconName} />
          </div>
        )}
      </RPopover.Trigger>
      <RPopover.Portal container={containerRef.current}>
        <RPopover.Content
          align={align}
          className={classNames('okp4-dataverse-portal-popover-content', contentClassName)}
          side={side}
          sideOffset={sideOffset}
        >
          {content}
        </RPopover.Content>
      </RPopover.Portal>
    </RPopover.Root>
  )
}
