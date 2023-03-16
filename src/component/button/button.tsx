import classNames from 'classnames'
import type { FC } from 'react'
import './button.scss'

type ButtonProps = {
  label?: string
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void
  iconButtonOnly?: JSX.Element
  icons?: {
    startIcon?: JSX.Element
    endIcon?: JSX.Element
  }
  variant?: 'secondary' | 'tertiary'
}

export const Button: FC<ButtonProps> = ({
  label,
  onClick,
  iconButtonOnly,
  icons,
  variant = 'secondary'
}) => {
  return (
    <button
      className={classNames('okp4-dataverse-portal-button-main', variant, {
        'icon-button': !!iconButtonOnly
      })}
      onClick={onClick}
    >
      {iconButtonOnly ?? (
        <div className={classNames('okp4-dataverse-portal-content-container', variant)}>
          {icons?.startIcon && icons.startIcon}
          {label && (
            <p className={classNames('okp4-dataverse-portal-button-label', variant)}>{label}</p>
          )}
          {icons?.endIcon && icons.endIcon}
        </div>
      )}
    </button>
  )
}
