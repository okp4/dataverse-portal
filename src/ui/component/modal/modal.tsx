import { type ReactNode, type FC, useCallback } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { CSSTransition } from 'react-transition-group'
import { useOnKeyboard } from '@/ui/hook/useOnKeyboard'
import './modal.scss'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  closeOnEsc?: boolean
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
  children,
  classes
}) => {
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === 'Escape') {
        onClose()
      }
    },
    [onClose, closeOnEsc]
  )

  useOnKeyboard(handleEscape)

  const handleOverlayClick = useCallback(() => {
    onClose()
  }, [onClose])

  const containerElement = document.getElementById('modal')

  return (
    containerElement &&
    createPortal(
      <CSSTransition
        // classNames={motionPreset === 'zoom' ? 'zoom-transition' : ''}
        className="zoom-transition"
        in={isOpen}
        timeout={200}
        unmountOnExit
      >
        onClick={handleOverlayClick}
      >
        <div
          className={classNames('okp4-dataverse-portal-modal-dialog', classes?.main)}
          role="dialog"
        >
          <div className="okp4-dataverse-portal-modal-content">{children}</div>
        </div>
        </div>
      </CSSTransition>,
      containerElement
    )
  )
}
