import { type FC } from 'react'
import classNames from 'classnames'
import { Modal, type ModalProps } from '@/ui/component/modal/modal'
import './okp4-modal.scss'

type Okp4ModalProps = ModalProps & {
  topElement: JSX.Element
  bottomElement: JSX.Element
}

export const Okp4Modal: FC<Okp4ModalProps> = ({
  topElement,
  bottomElement,
  classes,
  ...modalProps
}) => (
  <Modal
    {...modalProps}
    classes={{ main: classNames('okp4-dataverse-portal-okp4-modal-main', classes?.main) }}
  >
    <div className="okp4-dataverse-portal-okp4-modal-top-element">{topElement} </div>
    <div className="okp4-dataverse-portal-okp4-modal-top-element-divider" />
    <div className="okp4-dataverse-portal-okp4-modal-content-container">
      <div className="okp4-dataverse-portal-okp4-modal-content">{modalProps.children}</div>
    </div>
    <div className="okp4-dataverse-portal-okp4-modal-bottom-element">{bottomElement} </div>
  </Modal>
)
