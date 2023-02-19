import type { FC } from 'react'
import './button.scss'

type ButtonProps = {
  label: string
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void
  icons?: {
    startIcon?: JSX.Element
    endIcon?: JSX.Element
  }
}

export const Button: FC<ButtonProps> = ({ label, onClick, icons }) => (
  <button className="okp4-dataverse-portal-button-main" onClick={onClick}>
    <div className="okp4-dataverse-portal-content-container">
      {icons?.startIcon && icons.startIcon}
      <p className="okp4-dataverse-portal-button-label">{label}</p>
      {icons?.endIcon && icons.endIcon}
    </div>
  </button>
)
