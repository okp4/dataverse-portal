import { type FC, type ChangeEvent, useCallback, useState, useRef } from 'react'
import classNames from 'classnames'
import { Icon } from '@/ui/component/icon/icon'
import './field.scss'

type FieldProps = {
  id: string
  label: string
  onChange: (value: string) => void
  value?: string
  type?: 'text' | 'number'
  error?: string
  required?: boolean
  disabled?: boolean
  multiline?: boolean
  resizable?: boolean
  leftElement?: JSX.Element
  rightElement?: JSX.Element
}

// eslint-disable-next-line max-lines-per-function
export const Field: FC<FieldProps> = ({
  id,
  label,
  onChange,
  value,
  type = 'text',
  error,
  required = false,
  disabled = false,
  multiline = false,
  resizable = false,
  leftElement,
  rightElement
}) => {
  const [focused, setFocused] = useState(false)
  const handleFocus = useCallback((): void => setFocused(true), [])
  const handleBlur = useCallback((): void => setFocused(false), [])
  const textInputRef = useRef(null)

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      onChange(e.target.value)
    },
    [onChange]
  )

  const textFieldClassNames = classNames(
    { filled: value },
    { error },
    { focus: focused },
    { disabled },
    { resizable },
    { 'with-left-element': leftElement },
    { 'with-right-element': rightElement }
  )

  const textFieldInputProps = {
    className: classNames(textFieldClassNames, 'okp4-dataverse-portal-field-input'),
    disabled,
    id,
    name: id,
    onBlur: handleBlur,
    onChange: handleChange,
    onFocus: handleFocus,
    required,
    ref: textInputRef,
    value
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

      {multiline ? (
        <textarea {...textFieldInputProps} />
      ) : (
        <input {...textFieldInputProps} type={type} />
      )}

      {rightElement && (
        <div
          className={classNames(textFieldClassNames, 'okp4-dataverse-portal-field-right-element')}
        >
          {rightElement}
        </div>
      )}
      <label
        className={classNames(textFieldClassNames, 'okp4-dataverse-portal-field-label')}
        htmlFor={id}
      >
        {required ? label + '*' : label}
      </label>
      {error && (
        <p className="okp4-dataverse-portal-field-error">
          <Icon name="info-light" />
          <span className="okp4-dataverse-portal-field-error-message">{error}</span>
        </p>
      )}
    </div>
  )
}
