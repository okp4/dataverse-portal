import classNames from 'classnames'
import { useEffect } from 'react'
import './toast.scss'

type ToastVariants = 'success' | 'error' | 'warning' | 'info'

type ToastProps = {
  title: string
  autoHideDuration?: number
  description?: string
  icon?: JSX.Element
  onClose?: () => void
  open?: boolean
  variant?: ToastVariants
}

export const Toast = ({
  title,
  autoHideDuration,
  description,
  icon,
  onClose,
  open = false,
  variant = 'info'
}: ToastProps): JSX.Element | null => {
  useEffect(() => {
    if (open && autoHideDuration) {
      const autoHideDurationTimer = setTimeout(() => {
        onClose?.()
      }, autoHideDuration)
      return () => {
        clearTimeout(autoHideDurationTimer)
      }
    }
  }, [autoHideDuration, onClose, open])

  if (!open) return null

  return (
    <div className={classNames('okp4-dataverse-portal-toast-main', { show: open })}>
      <div className="okp4-dataverse-portal-toast-container">
        <div className="okp4-dataverse-portal-toast-header-container">
          {icon && <div className="okp4-dataverse-portal-toast-icon">{icon}</div>}
          <p className={classNames(`okp4-dataverse-portal-toast-title ${variant}`)}>{title}</p>
        </div>
        {description && (
          <p className={classNames(`okp4-dataverse-portal-toast-description`)}>{description}</p>
        )}
      </div>
    </div>
  )
}
