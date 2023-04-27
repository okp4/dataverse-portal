import classNames from 'classnames'
import type { FC } from 'react'
import { useCallback, useRef, useEffect, useState } from 'react'
import type { NotificationID, NotificationType } from '@/domain/notification/entity'
import type { IconName } from '@/ui/component/icon/icon'
import { Icon } from '@/ui/component/icon/icon'
import { useOnClickOutside } from '@/ui/hook/useOnClickOutside'
import { useOnKeyboard } from '@/ui/hook/useOnKeyboard'
import { Button } from '@/ui/component//button/button'
import type { DismissNotificationInput } from '@/domain/notification/aggregate'
import '@/ui/component/notifications/i18n'
import './toast.scss'
import { useTranslation } from 'react-i18next'

type ToastCTAProps = {
  action: string
}
const ToastCTA: FC<ToastCTAProps> = ({ action }) => {
  const { t } = useTranslation('notifications')

  const handleClick = useCallback(() => {
    window.location.reload()
  }, [])

  return (
    <Button
      className="okp4-dataverse-portal-toast-cta"
      label={t(`action.${action}`)}
      onClick={handleClick}
      variant="primary"
    />
  )
}

type ToastProps = {
  id: NotificationID
  type: NotificationType
  title: string
  onClose: (input: DismissNotificationInput) => void
  message?: string
  iconName?: IconName
  action?: string
}

// eslint-disable-next-line max-lines-per-function
export const Toast: FC<ToastProps> = ({ id, type, title, onClose, message, iconName, action }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isHidding, setIsHidding] = useState(false)
  const timeoutRef = useRef<number>()
  const autoHideTimeoutRef = useRef<number>()

  const handleAction = useCallback(() => {
    if (isHidding) return
    setIsHidding(true)
  }, [isHidding])

  useEffect(() => {
    if (action) return
    autoHideTimeoutRef.current = setTimeout(() => {
      handleAction()
    }, 3000)
    return () => clearTimeout(autoHideTimeoutRef.current)
  }, [handleAction, action])

  useEffect(() => {
    if (!isHidding) return
    timeoutRef.current = setTimeout(() => {
      onClose({ id })
    }, 400) // must be equal to hide-toast animation duration
    return () => clearTimeout(timeoutRef.current)
  }, [onClose, type, isHidding, id])

  const clickOutsideHandler = useCallback(() => {
    if (!action) return
    handleAction()
  }, [handleAction, action])

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (!action) return
      if (event.key === 'Escape') {
        handleAction()
      }
    },
    [handleAction, action]
  )

  useOnClickOutside<HTMLDivElement>(containerRef, clickOutsideHandler)
  useOnKeyboard(handleKeydown, 'keydown')

  return (
    <div className="okp4-dataverse-portal-toast-main">
      <div
        className={classNames(
          'okp4-dataverse-portal-toast-container',
          {
            'is-hidding': isHidding
          },
          { 'has-action': action }
        )}
        ref={containerRef}
      >
        <div className="okp4-dataverse-portal-toast-details-container">
          <div className="okp4-dataverse-portal-toast-header-container">
            {iconName && <Icon name={iconName} />}
            <h3 className={classNames(`okp4-dataverse-portal-toast-title ${type}`)}>{title}</h3>
          </div>
          {message && (
            <p className={classNames(`okp4-dataverse-portal-toast-description`)}>{message}</p>
          )}
        </div>
        {action && <ToastCTA action={action} />}
      </div>
    </div>
  )
}
