import { type ReactNode, type FC, useCallback, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { useOnKeyboard } from '@/ui/hook/useOnKeyboard'
import './modal.scss'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  closeOnEsc?: boolean
  isCentered?: boolean
  motionPreset?: 'zoom' | 'none'
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
  motionPreset = 'zoom',
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

  const prevIsOpenRef = useRef(isOpen)

  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (prevIsOpenRef.current && !isOpen) {
      setIsClosing(true)
      const timeoutId = setTimeout(() => {
        setIsClosing(false)
      }, 200)
      return () => clearTimeout(timeoutId)
    }
    prevIsOpenRef.current = isOpen
  }, [isOpen])

  return (
    isOpen &&
    containerElement &&
    createPortal(
      <div
        className={classNames('okp4-dataverse-portal-modal-main', classes?.overlay)}
        onClick={handleOverlayClick}
      >
        <div
          className={classNames('okp4-dataverse-portal-modal-dialog', classes?.main, isCentered, {
            zoom: motionPreset === 'zoom',
            open: isOpen,
            closing: isClosing
          })}
          role="dialog"
        >
          <div className="okp4-dataverse-portal-modal-content">{children}</div>
        </div>
      </div>,
      containerElement
    )
  )
}
