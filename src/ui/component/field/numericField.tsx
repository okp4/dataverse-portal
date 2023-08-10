import type { FC, ChangeEvent } from 'react'
import { useCallback, useMemo, useState } from 'react'
import classNames from 'classnames'
import { maskitoNumberOptionsGenerator } from '@maskito/kit'
import { useMaskito } from '@maskito/react'
import type { BaseFieldProps } from './baseField'
import { BaseField } from './baseField'
import './field.scss'

type NumericFieldProps = BaseFieldProps & {
  precision?: number
  thousandSeparator?: string
  decimalSeparator?: string
  decimalPseudoSeparators?: string[]
  min?: number
  max?: number
}

// eslint-disable-next-line max-lines-per-function
export const NumericField: FC<NumericFieldProps> = ({
  label,
  error,
  leftElement,
  rightElement,
  precision,
  thousandSeparator,
  decimalSeparator = '.',
  decimalPseudoSeparators = [',', '.', 'ю', 'б'],
  min,
  max,
  ...inputProps
}) => {
  const { id, onChange } = inputProps

  const numericOptions = useMemo(
    () =>
      maskitoNumberOptionsGenerator({
        precision,
        thousandSeparator,
        decimalSeparator,
        decimalPseudoSeparators,
        min,
        max
      }),
    [precision, thousandSeparator, decimalSeparator, decimalPseudoSeparators, min, max]
  )

  const inputRef = useMaskito({ options: numericOptions })

  const [focused, setFocused] = useState(false)
  const handleFocus = useCallback((): void => setFocused(true), [])
  const handleBlur = useCallback((): void => setFocused(false), [])

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const allowedIntermediatePatterns = [decimalSeparator, ...decimalPseudoSeparators].map(
        separator => new RegExp(`\\${separator}0*$`)
      )

      if (allowedIntermediatePatterns.some(pattern => pattern.test(event.target.value))) return

      onChange?.(event)
    },
    [onChange, decimalSeparator, decimalPseudoSeparators]
  )

  return (
    <BaseField
      className={classNames({ focus: focused })}
      {...inputProps}
      error={error}
      inputElement={
        <input
          ref={inputRef}
          {...inputProps}
          className="okp4-dataverse-portal-field-input"
          name={id}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onInput={handleChange}
        />
      }
      label={label}
      leftElement={leftElement}
      rightElement={rightElement}
    />
  )
}
