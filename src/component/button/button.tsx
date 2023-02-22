import type { FC } from 'react'
import './button.scss'

type ButtonProps = {
  label: string
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void
  icons?: {
    startIcon?: JSX.Element
    endIcon?: JSX.Element
  }
  variant?: 'secondary' | 'tertiary'
}

export const Button: FC<ButtonProps> = ({ label, onClick, icons, variant = 'secondary' }) => (
  <button className={`okp4-dataverse-portal-button-main ${variant}`} onClick={onClick}>
    <div className={`okp4-dataverse-portal-content-container ${variant}`}>
      {icons?.startIcon && icons.startIcon}
      <p className={`okp4-dataverse-portal-button-label ${variant}`}>{label}</p>
      {icons?.endIcon && icons.endIcon}
    </div>
  </button>
)
