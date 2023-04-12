import classNames from 'classnames'
import './toast.scss'
import { useEffect } from 'react'

type ToastVariants = 'success' | 'error' | 'warning' | 'info'

type ToastProps = {
  title: string
  autoHideDuration?: number
  description?: string
  onClose?: () => void
  icon?: JSX.Element
  open?: boolean
  variant?: ToastVariants
}

export const Toast = ({
  autoHideDuration,
  description,
  icon,
  onClose,
  open = false,
  title,
  variant = 'info'
}: ToastProps): JSX.Element | null => {
  useEffect(() => {
    if (autoHideDuration) {
      const timer1 = setTimeout(() => {
        onClose?.()
      }, autoHideDuration)
      return () => {
        clearTimeout(timer1)
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
          <p className={classNames(`okp4-dataverse-portal-toast-description `)}>{description}</p>
        )}
      </div>
    </div>
  )
}
