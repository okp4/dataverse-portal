import { type ReactNode, type FC, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { CSSTransition } from 'react-transition-group'
import { useOnKeyboard } from '@/ui/hook/useOnKeyboard'
import './modal.scss'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  closeOnEsc?: boolean
  motionPreset?: 'zoom' | 'none'
  isCentered?: boolean
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
  motionPreset = 'zoom',
  isCentered = true,
  children,
  classes
}) => {
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    containerRef.current = document.getElementById('modal-root')
  }, [])

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

  const handleDialogOnClick = useCallback((e: React.MouseEvent): void => {
    e.stopPropagation()
  }, [])

  if (!containerRef.current) {
    return null
  }

  return createPortal(
    <CSSTransition
      classNames={motionPreset === 'zoom' ? 'zoom-transition' : ''}
      in={isOpen}
      nodeRef={containerRef}
      timeout={200}
      unmountOnExit
    >
      <div
        className={classNames(
          'okp4-dataverse-portal-modal-main',
          isCentered && 'centered',
          classes?.overlay
        )}
        onClick={handleOverlayClick}
      >
        <div
          aria-hidden
          aria-modal
          className={classNames('okp4-dataverse-portal-modal-dialog', classes?.main)}
          onClick={handleDialogOnClick}
          role="dialog"
          tabIndex={-1}
        >
          <div className="okp4-dataverse-portal-modal-content">{children}</div>
        </div>
      </div>
    </CSSTransition>,
    containerRef.current
  )
}
