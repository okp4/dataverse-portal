import classNames from 'classnames'
import type { FC } from 'react'
import { useCallback, useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { NotificationID, NotificationType } from '@/domain/notification/entity'
import type { IconName } from '@/ui/component/icon/icon'
import { Icon } from '@/ui/component/icon/icon'
import { useOnClickOutside } from '@/ui/hook/useOnClickOutside'
import { useOnKeyboard } from '@/ui/hook/useOnKeyboard'
import { Button } from '@/ui/component//button/button'
import type { DismissNotificationInput } from '@/domain/notification/aggregate'
import '@/ui/component/notifications/i18n'
import './toast.scss'

type ToastCTAProps = {
  type: NotificationType
  action: string
}
const ToastCTA: FC<ToastCTAProps> = ({ action, type }) => {
  const { t } = useTranslation('notifications')

  const handleClick = useCallback(() => {
    window.location.reload()
  }, [])
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
  onClose: (input: DismissNotificationInput) => void
  message?: string
  iconName?: IconName
  action?: string
  index: number
}

// eslint-disable-next-line max-lines-per-function
export const Toast: FC<ToastProps> = ({
  id,
  type,
  title,
  onClose,
  message,
  iconName,
  action,
  index
}) => {
  const [isHidding, setIsHidding] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const autoHideTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const animationDurationRef = useRef<number>(500)
  const stackedPosition = useRef<number>(index + 1)

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
    }, animationDurationRef.current)
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
    <div
      className={classNames('okp4-dataverse-portal-toast-main', {
        'has-action': action
      })}
    >
      <div
        className={classNames('okp4-dataverse-portal-toast-container', { 'has-action': action })}
        ref={containerRef}
        style={{
          animation: `${isHidding ? 'hide' : 'show'}-toast-${stackedPosition.current} ${
            animationDurationRef.current
          }ms ease-in-out forwards`
        }}
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
      </div>
    </div>
  )
}
