import type { FC, ChangeEvent } from 'react'
import { useCallback, useState } from 'react'
import classNames from 'classnames'
import type { NumericFormatProps } from 'react-number-format'
import { NumericFormat } from 'react-number-format'
import type { BaseFieldProps } from './baseField'
import { BaseField } from './baseField'
import './field.scss'

type NumericFieldProps = NumericFormatProps & BaseFieldProps

export const NumericField: FC<NumericFieldProps> = ({
  label,
  error,
  leftElement,
  rightElement,
  ...inputProps
}) => {
  const { id, onChange } = inputProps

  const [focused, setFocused] = useState(false)
  const handleFocus = useCallback((): void => setFocused(true), [])
  const handleBlur = useCallback((): void => setFocused(false), [])

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      onChange?.(event)
    },
    [onChange]
  )

  return (
    <BaseField
      className={classNames({ focus: focused })}
      {...inputProps}
      error={error}
      inputElement={
        <NumericFormat
          {...inputProps}
          className="okp4-dataverse-portal-field-input"
          name={id}
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleFocus}
        />
      }
      label={label}
      leftElement={leftElement}
      rightElement={rightElement}
    />
  )
}
