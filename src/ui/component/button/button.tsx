import classNames from 'classnames'
import type { FC } from 'react'
import './button.scss'

export type Icons = {
  startIcon?: JSX.Element
  endIcon?: JSX.Element
}

type ButtonProps = {
  className?: string
  disabled?: boolean
  label?: string
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void
  iconButtonOnly?: JSX.Element
  icons?: Icons
  variant?:
    | 'primary'
    | 'primary-discreet'
    | 'secondary'
    | 'secondary-discreet'
    | 'outlined-secondary'
    | 'tertiary'
    | 'outlined-tertiary'
    | 'quaternary-turquoise'
  size?: 'small' | 'large'
}

export const Button: FC<ButtonProps> = ({
  className,
  disabled = false,
  label,
  onClick,
  iconButtonOnly,
  icons,
  variant = 'secondary',
  size = 'small'
}) => {
  return (
    <button
      className={classNames('okp4-dataverse-portal-button-main', className, variant, {
        'icon-button': !!iconButtonOnly,
        disabled
      })}
      onClick={onClick}
    >
      {iconButtonOnly ?? (
        <div className={classNames('okp4-dataverse-portal-content-container', variant, size)}>
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
