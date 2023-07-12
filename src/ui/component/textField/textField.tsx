import { type FC, type ChangeEvent, useCallback, useState, useRef } from 'react'
import classNames from 'classnames'
import { Icon } from '@/ui/component/icon/icon'
import './textField.scss'

type TextFieldProps = {
  id: string
  label: string
  onChange: (value: string) => void
  value?: string
  error?: string
  required?: boolean
  disabled?: boolean
  multiline?: boolean
  resizable?: boolean
  leftElement?: JSX.Element
  rightElement?: JSX.Element
}

// eslint-disable-next-line max-lines-per-function
export const TextField: FC<TextFieldProps> = ({
  id,
  label,
  onChange,
  value,
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
    className: classNames(textFieldClassNames, 'okp4-dataverse-portal-text-field-input'),
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
    <div className={classNames(textFieldClassNames, 'okp4-dataverse-portal-text-field-main')}>
      {leftElement && (
        <div
          className={classNames(
            textFieldClassNames,
            'okp4-dataverse-portal-text-field-left-element'
          )}
        >
          {leftElement}
        </div>
      )}

      {multiline ? (
        <textarea {...textFieldInputProps} />
      ) : (
        <input {...textFieldInputProps} type="text" />
      )}

      {rightElement && (
        <div
          className={classNames(
            textFieldClassNames,
            'okp4-dataverse-portal-text-field-right-element'
          )}
        >
          {rightElement}
        </div>
      )}
      <label
        className={classNames(textFieldClassNames, 'okp4-dataverse-portal-text-field-label')}
        htmlFor={id}
      >
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
