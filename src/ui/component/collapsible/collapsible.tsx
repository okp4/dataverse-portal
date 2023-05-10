import type { FC } from 'react'
import { useState, useCallback } from 'react'
import classNames from 'classnames'
import * as RCollapsible from '@radix-ui/react-collapsible'
import { Icon } from '@/ui/component/icon/icon'
import './collapsible.scss'

type CollapsibleProps = {
  triggerText: string | JSX.Element
  children: JSX.Element
  open: boolean
}

export const Collapsible: FC<CollapsibleProps> = ({ triggerText, children, open }) => {
  const [isOpen, setIsOpen] = useState<boolean>(open)
  const [isChanging, setIsChanging] = useState<boolean>(false)

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setIsChanging(true)
    const timeout = setTimeout(() => {
      setIsChanging(false)
      clearTimeout(timeout)
    }, 300) // must match the open/close animation duration in collapsible.scss
    setIsOpen(isOpen)
  }, [])

  return (
    <RCollapsible.Root
      className="okp4-dataverse-portal-collapsible-main"
      onOpenChange={handleOpenChange}
      open={isOpen}
    >
      <RCollapsible.Trigger className="okp4-dataverse-portal-collapsible-trigger">
        {triggerText}
        <div
          className={classNames('okp4-dataverse-portal-collapsible-trigger-icon', {
            flipped: isOpen
          })}
        >
          <Icon name="chevron" />
        </div>
      </RCollapsible.Trigger>
      <RCollapsible.Content
        className={classNames('okp4-dataverse-portal-collapsible-content', {
          'is-changing': isChanging
        })}
      >
        {children}
      </RCollapsible.Content>
    </RCollapsible.Root>
  )
}
