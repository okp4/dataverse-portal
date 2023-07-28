import { type FC, type ChangeEvent, useCallback, useState, useRef } from 'react'
import classNames from 'classnames'
import type { NumericFormatProps } from 'react-number-format'
import { NumericFormat } from 'react-number-format'
import { Icon } from '@/ui/component/icon/icon'
import './field.scss'

type InputProps = Omit<NumericFormatProps, 'type'> & {
  id: string
  onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  value?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
}

type FieldProps = InputProps & {
  label?: string
  type?: 'text' | 'numeric'
  error?: string
  multiline?: boolean
  resizable?: boolean
  leftElement?: JSX.Element
  rightElement?: JSX.Element
}

// eslint-disable-next-line max-lines-per-function
export const Field: FC<FieldProps> = props => {
  const {
    id,
    label,
    onChange,
    value,
    type = 'text',
    error,
    placeholder,
    required = false,
    disabled = false,
    readonly = false,
    multiline = false,
    resizable = false,
    leftElement,
    rightElement
  } = props
  const [focused, setFocused] = useState(false)
  const handleFocus = useCallback((): void => setFocused(true), [])
  const handleBlur = useCallback((): void => setFocused(false), [])

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      onChange?.(event)
    },
    [onChange]
  )

  const textFieldClassNames = classNames(
    { filled: readonly || value },
    { readonly },
    { error },
    { focus: focused },
    { disabled },
    { resizable },
    { 'with-left-element': leftElement },
    { 'with-right-element': rightElement },
    { 'with-placeholder': placeholder }
  )

  const textFieldInputProps = {
    className: classNames(textFieldClassNames, 'okp4-dataverse-portal-field-input'),
    disabled,
    id,
    name: id,
    onBlur: handleBlur,
    ...(onChange && { onChange: handleChange }),
    onFocus: handleFocus,
    readOnly: readonly,
    required,
    value,
    placeholder
  }

  const numericInputProps = {
    ...props,
    ...textFieldInputProps
  }

  return (
    <div className={classNames(textFieldClassNames, 'okp4-dataverse-portal-field-main')}>
      {leftElement && (
        <div
          className={classNames(textFieldClassNames, 'okp4-dataverse-portal-field-left-element')}
        >
          {leftElement}
        </div>
      )}

      {type === 'numeric' ? (
        <NumericFormat {...numericInputProps} type="text" />
      ) : multiline ? (
        <textarea {...textFieldInputProps} />
      ) : (
        <input {...textFieldInputProps} />
      )}

      {rightElement && (
        <div
          className={classNames(textFieldClassNames, 'okp4-dataverse-portal-field-right-element')}
        >
          {rightElement}
        </div>
      )}

      {label && (
        <label
          className={classNames(textFieldClassNames, 'okp4-dataverse-portal-field-label')}
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
