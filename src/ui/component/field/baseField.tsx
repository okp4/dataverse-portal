import type { ReactNode } from 'react'
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
  children?: ReactNode
  className?: string
}

// eslint-disable-next-line max-lines-per-function
export const BaseField: FC<BaseFieldProps> = ({
  id,
  value,
  label,
  placeholder,
  disabled = false,
  readOnly = false,
  required = false,
  error,
  leftElement,
  rightElement,
  children,
  className
}) => {
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

      {children}

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
