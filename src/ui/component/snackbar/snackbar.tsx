import classNames from 'classnames'
import type { FC } from 'react'
import { useCallback, useRef } from 'react'
import type { IconName } from '@/ui/component/icon/icon'
import { Icon } from '@/ui/component/icon/icon'
import { useOnClickOutside } from '@/ui/hook/useOnClickOutside'
import { useOnKeyboard } from '@/ui/hook/useOnKeyboard'
import { Button } from '@/ui/component//button/button'
import './snackbar.scss'
import { NotificationType } from '@/domain/notification/entity'

const SnackbarCTA: FC = () => {
  const handleClick = useCallback(() => {
    window.location.reload()
  }, [])

  return (
    <Button
      className="okp4-dataverse-portal-snackbar-cta"
      label="Refresh"
      onClick={handleClick}
      variant="primary"
    />
  )
}

type SnackbarProps = {
  severity: NotificationType
  title: string
  onClose: (severity: NotificationType) => void
  description?: string
  iconName?: IconName
  action?: NotificationAction
}

export const Snackbar: FC<SnackbarProps> = ({
  severity,
  title,
  onClose,
  description,
  iconName,
  action
}) => {
  const mainRef = useRef<HTMLDivElement | null>(null)

  const clickOutsideHandler = useCallback(() => {
    onClose(severity)
  }, [severity, onClose])

  const handleMenuItemKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose(severity)
      }
    },
    [severity, onClose]
  )

  useOnClickOutside<HTMLDivElement>(mainRef, clickOutsideHandler)
  useOnKeyboard(handleMenuItemKeydown, 'keydown')

  return (
    <div className="okp4-dataverse-portal-snackbar-main" ref={mainRef}>
      <div className="okp4-dataverse-portal-snackbar-container">
        <div className="okp4-dataverse-portal-snackbar-header-container">
          {iconName && <Icon name={iconName} />}
          <h3 className={classNames(`okp4-dataverse-portal-snackbar-title ${severity}`)}>
            {title}
          </h3>
        </div>
        {description && (
          <p className={classNames(`okp4-dataverse-portal-snackbar-description`)}>{description}</p>
        )}
      </div>
      {action && <SnackbarCTA />}
    </div>
  )
}
