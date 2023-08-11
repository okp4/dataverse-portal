import type { FC, ChangeEvent } from 'react'
import { useCallback } from 'react'
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

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      onChange?.(event)
    },
    [onChange]
  )

  return (
    <BaseField
      className={classNames({ resizable })}
      {...inputProps}
      error={error}
      inputElement={
        multiline && (
          <textarea
            {...inputProps}
            className="okp4-dataverse-portal-field-input"
            name={id}
            onChange={handleChange}
          />
        )
      }
      label={label}
      leftElement={leftElement}
      onChange={handleChange}
      rightElement={rightElement}
    />
  )
}
