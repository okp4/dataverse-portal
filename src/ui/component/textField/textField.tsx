import { type FC, type ChangeEvent, useCallback } from 'react'
import classNames from 'classnames'
import { Icon } from '@/ui/component/icon/icon'
import './textField.scss'

type Icons = {
  startIcon?: JSX.Element
  endIcon?: JSX.Element
}

type TextFieldProps = {
  id: string
  label: string
  onChange: (value: string) => void
  value?: string
  error?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  multiline?: boolean
  resizable?: boolean
  icons?: Icons
}

// eslint-disable-next-line max-lines-per-function
export const TextField: FC<TextFieldProps> = ({
  id,
  label,
  onChange,
  value,
  error,
  readonly = false,
  required = false,
  disabled = false,
  multiline = false,
  resizable = false,
  icons
}) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      onChange(e.target.value)
    },
    [onChange]
  )

  const inputClassName = classNames(
    'okp4-dataverse-portal-text-field',
    { filled: value },
    { error },
    { resizable },
    { 'with-start-icon': icons?.startIcon },
    { 'with-end-icon': icons?.endIcon }
  )

  return (
    <div className="okp4-dataverse-portal-text-field-main">
      {multiline ? (
        <textarea
          className={inputClassName}
          disabled={disabled}
          id={id}
          name={id}
          onChange={handleChange}
          readOnly={readonly}
          required={required}
          value={value}
        />
      ) : (
        <input
          className={inputClassName}
          disabled={disabled}
          id={id}
          name={id}
          onChange={handleChange}
          readOnly={readonly}
          required={required}
          type="text"
          value={value}
        />
      )}
      {icons?.startIcon && (
        <div className="okp4-dataverse-portal-text-field-start-icon">{icons.startIcon}</div>
      )}
      {icons?.endIcon && (
        <div className="okp4-dataverse-portal-text-field-end-icon">{icons.endIcon}</div>
      )}
      <label className="okp4-dataverse-portal-text-field-label" htmlFor={id}>
        {required ? label + '*' : label}
      </label>
      {error && (
        <p className="okp4-dataverse-portal-text-field-error">
          <Icon name="info-light" />
          <span className="okp4-dataverse-portal-text-field-error-message">{error}</span>
        </p>
      )}
    </div>
  )
}
