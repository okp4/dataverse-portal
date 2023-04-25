import classNames from 'classnames'
import { useEffect } from 'react'
import type { IconName } from '@/ui/component/icon/icon'
import { Icon } from '@/ui/component/icon/icon'
import './toast.scss'
import { NotificationType } from '@/domain/notification/entity'

type ToastProps = {
  severity: NotificationType
  title: string
  onClose: (severity: NotificationType) => void
  description?: string
  iconName?: IconName
}

export const Toast = ({
  severity,
  title,
  description,
  iconName,
  onClose
}: ToastProps): JSX.Element => {
  useEffect(() => {
    const autoHideDurationTimer = setTimeout(() => {
      onClose(severity)
    }, 3000)
    return () => {
      clearTimeout(autoHideDurationTimer)
    }
  }, [onClose, severity])

  return (
    <div className={classNames('okp4-dataverse-portal-toast-main', { autoclose: true })}>
      <div className="okp4-dataverse-portal-toast-container">
        <div className="okp4-dataverse-portal-toast-header-container">
          {iconName && (
            <div className="okp4-dataverse-portal-toast-icon">
              <Icon name={iconName} />
            </div>
          )}
          <p className={classNames(`okp4-dataverse-portal-toast-title ${severity}`)}>{title}</p>
        </div>
        {description && (
          <p className={classNames(`okp4-dataverse-portal-toast-description`)}>{description}</p>
        )}
      </div>
    </div>
  )
}
