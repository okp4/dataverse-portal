import type { ChangeEvent, ReactNode } from 'react'
import { type FC } from 'react'
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
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
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
    onChange
  } = inputProps

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
    <div className={classNames('okp4-dataverse-portal-field-main', className, baseFieldClassNames)}>
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
          onChange={onChange}
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
