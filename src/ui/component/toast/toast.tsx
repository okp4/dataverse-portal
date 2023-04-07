import classNames from 'classnames'
import './toast.scss'

type ToastVariants = 'success' | 'error' | 'warning' | 'information'

type ToastProps = {
  variant: ToastVariants
}

export const Toast = ({ variant }: ToastProps): JSX.Element => {
  return (
    <div className={classNames(`okp4-dataverse-portal-toast-main`)}>
      <p className={classNames(`okp4-dataverse-portal-toast-title ${variant}`)}>Title</p>
      <p className={classNames(`okp4-dataverse-portal-toast-description `)}>Description</p>
    </div>
  )
}
