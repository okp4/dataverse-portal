import type { FC, ChangeEvent } from 'react'
import { useCallback, useState } from 'react'
import classNames from 'classnames'
import type { BaseFieldProps } from './baseField'
import { BaseField } from './baseField'
import './field.scss'

type TextFieldProps = BaseFieldProps & {
  multiline?: boolean
  resizable?: boolean
  onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

// eslint-disable-next-line max-lines-per-function
export const TextField: FC<TextFieldProps> = ({
  label,
  error,
  leftElement,
  rightElement,
  resizable,
  multiline,
  ...inputProps
}) => {
  const { id, onChange } = inputProps

  const [focused, setFocused] = useState(false)
  const handleFocus = useCallback((): void => setFocused(true), [])
  const handleBlur = useCallback((): void => setFocused(false), [])

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      onChange?.(event)
    },
    [onChange]
  )

  return (
    <BaseField
      className={classNames({ focus: focused }, { resizable })}
      {...inputProps}
      error={error}
      inputElement={
        multiline && (
          <textarea
            {...inputProps}
            className="okp4-dataverse-portal-field-input"
            name={id}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
          />
        )
      }
      label={label}
      leftElement={leftElement}
      onBlur={handleBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      rightElement={rightElement}
    />
  )
}
