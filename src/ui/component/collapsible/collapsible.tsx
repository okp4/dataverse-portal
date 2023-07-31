import { useEffect, useMemo, useRef, useState } from 'react'
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
  onOpenChange?: (isOpened: boolean) => void
  floatingContent?: boolean
  contentExpandDirection?: 'up' | 'down'
}

// eslint-disable-next-line max-lines-per-function
export const Collapsible: FC<CollapsibleProps> = ({
  open = false,
  content,
  trigger,
  contentClassName,
  rootClassName,
  triggerClassName,
  iconName = 'chevron',
  onOpenChange,
  floatingContent = false,
  contentExpandDirection = 'down'
}) => {
  const [triggerInitWidth, setTriggerInitWidth] = useState<number>(0)
  const [isOpen, setIsOpen] = useState(open)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const openState = useMemo(() => (onOpenChange ? open : isOpen), [isOpen, open, onOpenChange])

  useEffect(() => {
    const triggerWidth = triggerRef.current?.clientWidth
    triggerWidth && setTriggerInitWidth(triggerWidth)
  }, [])

  return (
    <RCollapsible.Root
      className={classNames(
        'okp4-dataverse-portal-collapsible-main',
        rootClassName,
        contentExpandDirection
      )}
      onOpenChange={onOpenChange ?? setIsOpen}
      open={openState}
    >
      <RCollapsible.Trigger
        className={classNames('okp4-dataverse-portal-collapsible-trigger-button', triggerClassName)}
        ref={triggerRef}
      >
        {trigger}
        <div
          className={classNames(
            'okp4-dataverse-portal-collapsible-trigger-icon',
            { flipped: openState },
            `${triggerClassName}-icon`
          )}
        >
          <Icon name={iconName} />
        </div>
      </RCollapsible.Trigger>
      <RCollapsible.Content
        className={classNames('okp4-dataverse-portal-collapsible-content', contentClassName, {
          [`floating ${contentExpandDirection}`]: floatingContent
        })}
        style={{
          // Copying the behaviour of the Radix-ui collapsible, for the slide animations
          ['--okp4-collapsible-trigger-initial-width' as string]: `${triggerInitWidth}px`
        }}
      >
        {content}
      </RCollapsible.Content>
    </RCollapsible.Root>
  )
}
