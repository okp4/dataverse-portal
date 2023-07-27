import { type ReactNode, type FC, useCallback } from 'react'
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

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  closeOnEsc = true,
  isCentered = false,
  motionPreset,
  children,
  classes
}) => {
  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (closeOnEsc && event.key === 'Escape') {
        onClose()
      }
    },
    [closeOnEsc, onClose]
  )

  const handleOverlayClick = useCallback(() => {
    onClose()
  }, [onClose])

  return isOpen ? (
    <div
      className={classNames('okp4-dataverse-portal-modal-main', classes?.overlay)}
      onClick={handleOverlayClick}
    >
      <div
        className={classNames(
          'okp4-dataverse-portal-modal-content',
          classes?.main,
          isCentered,
          motionPreset
        )}
        onKeyDown={handleKeyPress}
        role="dialog" //?
      >
        {children}
        <Button label="Close" onClick={onClose} variant="outlined-tertiary" />
      </div>
    </div>
  ) : null
}
