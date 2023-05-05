import classNames from 'classnames'
import type { FC } from 'react'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as ToastPrimitive from '@radix-ui/react-toast'
import type { NotificationID, NotificationType } from '@/domain/notification/entity'
import type { IconName } from '@/ui/component/icon/icon'
import { Icon } from '@/ui/component/icon/icon'
import { useOnClickOutside } from '@/ui/hook/useOnClickOutside'
import { useOnKeyboard } from '@/ui/hook/useOnKeyboard'
import { Button } from '@/ui/component//button/button'
import type { DismissNotificationInput } from '@/domain/notification/aggregate'
import '@/ui/component/notification/i18n'
import './toast.scss'

export type ActionType = 'refresh'
const actionsEffects: Record<ActionType, () => void> = {
  refresh: () => window.location.reload()
}

type ToastCTAProps = {
  type: NotificationType
  action: ActionType
}
const ToastCTA: FC<ToastCTAProps> = ({ action, type }) => {
  const { t } = useTranslation('notification')

  const handleClick = useCallback(() => actionsEffects[action](), [action])
  return (
    <Button
      className={classNames('okp4-dataverse-portal-toast-cta', type)}
      label={t(`action.${action}`)}
      onClick={handleClick}
    />
  )
}

type ToastProps = {
  id: NotificationID
  type: NotificationType
  title: string
  duration: number
  onDismiss: (input: DismissNotificationInput) => void
  action?: ActionType
  message?: string
  iconName?: IconName
}

// eslint-disable-next-line max-lines-per-function
export const Toast: FC<ToastProps> = ({
  id,
  type,
  title,
  duration,
  onDismiss,
  action,
  message,
  iconName
}) => {
  const [isOpen, setIsOpen] = useState(true)
  const toastRootRef = useRef<HTMLLIElement | null>(null)

  const handleClose = useCallback(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        clearTimeout(timeout)
        onDismiss({ id })
      }, 200) // close animation duration. must match the one in toast.scss
      setIsOpen(false)
    }
  }, [id, onDismiss, isOpen])

  const clickOutsideHandler = useCallback(() => {
    if (!action) return
    handleClose()
  }, [handleClose, action])

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (!action) return
      if (event.key === 'Escape') {
        handleClose()
      }
    },
    [handleClose, action]
  )

  useOnClickOutside<HTMLLIElement>(toastRootRef, clickOutsideHandler)
  useOnKeyboard(handleKeydown, 'keydown')

  return (
    <ToastPrimitive.Provider swipeDirection="down">
      <ToastPrimitive.Root
        className={classNames('okp4-dataverse-portal-toast-root', {
          'has-action': action
        })}
        duration={duration}
        onOpenChange={handleClose}
        open={isOpen}
        ref={toastRootRef}
      >
        <div className="okp4-dataverse-portal-toast-details-container">
          <div className="okp4-dataverse-portal-toast-header-container">
            {iconName && (
              <div className="okp4-dataverse-portal-toast-icon">
                <Icon name={iconName} />
              </div>
            )}
            <h3 className={classNames('okp4-dataverse-portal-toast-title', type)}>{title}</h3>
          </div>
          {message && <p className="okp4-dataverse-portal-toast-description">{message}</p>}
        </div>
        {action && <ToastCTA action={action} type={type} />}
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport
        className={classNames('okp4-dataverse-portal-toast-main', {
          'has-action': action
        })}
      />
    </ToastPrimitive.Provider>
  )
}
