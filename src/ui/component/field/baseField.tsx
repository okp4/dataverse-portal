import type { ChangeEvent, FocusEvent, ReactNode } from 'react'
import { useCallback, type FC } from 'react'
import classNames from 'classnames'
import { Icon } from '@/ui/component/icon/icon'
import './field.scss'

export type BaseFieldProps = {
  id: string
  value?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  error?: string
  leftElement?: JSX.Element
  rightElement?: JSX.Element
  inputElement?: ReactNode
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

// eslint-disable-next-line max-lines-per-function
export const BaseField: FC<BaseFieldProps> = ({
  label,
  error,
  leftElement,
  rightElement,
  className,
  inputElement,
  ...inputProps
}) => {
  const {
    id,
    value,
    placeholder,
    disabled = false,
    readOnly = false,
    required = false,
    onChange,
    onFocus,
    onBlur
  } = inputProps

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>): void => onFocus?.(event),
    [onFocus]
  )
  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>): void => onBlur?.(event),
    [onBlur]
  )

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      onChange?.(event)
    },
    [onChange]
  )

  const baseFieldClassNames = classNames(
    { filled: readOnly || value },
    { readonly: readOnly },
    { error },
    { disabled },
    { 'with-left-element': leftElement },
    { 'with-right-element': rightElement },
    { 'with-placeholder': placeholder }
  )

  return (
    <div className={classNames(className, baseFieldClassNames, 'okp4-dataverse-portal-field-main')}>
      {leftElement && (
        <div
          className={classNames(
            className,
            baseFieldClassNames,
            'okp4-dataverse-portal-field-left-element'
          )}
        >
          {leftElement}
        </div>
      )}

      {inputElement ?? (
        <input
          {...inputProps}
          className="okp4-dataverse-portal-field-input"
          name={id}
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleFocus}
        />
      )}

      {rightElement && (
        <div
          className={classNames(
            className,
            baseFieldClassNames,
            'okp4-dataverse-portal-field-right-element'
          )}
        >
          {rightElement}
        </div>
      )}

      {label && (
        <label
          className={classNames(
            className,
            baseFieldClassNames,
            'okp4-dataverse-portal-field-label'
          )}
          htmlFor={id}
        >
          {required ? label + '*' : label}
        </label>
      )}

      {error && (
        <p className="okp4-dataverse-portal-field-error">
          <Icon name="info-light" />
          <span className="okp4-dataverse-portal-field-error-message">{error}</span>
        </p>
      )}
    </div>
  )
}
