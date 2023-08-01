import { type ReactNode, type FC, useCallback, useEffect } from 'react'
import classNames from 'classnames'
import { Button } from '@/ui/component/button/button'
import './modal.scss'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  closeOnEsc?: boolean
  isCentered?: boolean
  motionPreset?: string
  children?: ReactNode
  classes?: {
    main?: string
    overlay?: string
  }
}

// eslint-disable-next-line max-lines-per-function
export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  closeOnEsc = true,
  isCentered = true,
  motionPreset,
  children,
  classes
}) => {
  const handleKeyPress = useCallback(
    (event: { key: string }) => {
      if (closeOnEsc && event.key === 'Escape') {
        onClose()
      }
    },
    [closeOnEsc, onClose]
  )

  const handleOverlayClick = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      handleKeyPress(event)
    }

    if (isOpen && closeOnEsc) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (closeOnEsc) {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [closeOnEsc, handleKeyPress, isOpen])

  return (
    isOpen && (
      <div
        className={classNames('okp4-dataverse-portal-modal-main', classes?.overlay)}
        onClick={handleOverlayClick}
      >
        <div
          className={classNames(
            'okp4-dataverse-portal-modal-dialog',
            classes?.main,
            isCentered,
            motionPreset
          )}
          onKeyDown={handleKeyPress}
          role="dialog" //?
        >
          <div className="okp4-dataverse-portal-modal-wrapper">
            <div className="okp4-dataverse-portal-modal-content">{children}</div>
          </div>
          <Button
            className="okp4-dataverse-portal-modal-button"
            label="Close"
            onClick={onClose}
            variant="outlined-secondary"
          />
        </div>
      </div>
    )
  )
}
