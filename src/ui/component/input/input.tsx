import { type FC, type ChangeEvent, useCallback } from 'react'
import classNames from 'classnames'
import { Icon } from '@/ui/component/icon/icon'
import './input.scss'

type Icons = {
  startIcon?: JSX.Element
  endIcon?: JSX.Element
}

type InputProps = {
  id: string
  label: string
  onChange: (value: string) => void
  value?: string
  error?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  icons?: Icons
}

// eslint-disable-next-line max-lines-per-function
export const Input: FC<InputProps> = ({
  id,
  label,
  onChange,
  value,
  error,
  readonly = false,
  required = false,
  disabled = false,
  icons
}) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      onChange(e.target.value)
    },
    [onChange]
  )

  return (
    <div className="okp4-dataverse-portal-input-main">
      <input
        className={classNames(
          'okp4-dataverse-portal-input-field',
          { filled: value },
          { error },
          { 'with-start-icon': icons?.startIcon },
          { 'with-end-icon': icons?.endIcon }
        )}
        disabled={disabled}
        id={id}
        onChange={handleChange}
        readOnly={readonly}
        required={required}
        type="text"
        value={value}
      />
      <div className="okp4-dataverse-portal-input-start-icon">
        {icons?.startIcon && icons.startIcon}
      </div>
      <div className="okp4-dataverse-portal-input-end-icon">{icons?.endIcon && icons.endIcon}</div>
      <label className="okp4-dataverse-portal-input-label" htmlFor={id}>
        {required ? label + '*' : label}
      </label>
      {error && (
        <p className="okp4-dataverse-portal-input-error">
          <Icon name="info-light" />
          <span className="okp4-dataverse-portal-input-error-message">{error}</span>
        </p>
      )}
    </div>
  )
}
