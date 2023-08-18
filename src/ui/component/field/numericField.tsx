import type { FC, ChangeEvent } from 'react'
import { useCallback, useMemo } from 'react'
import { maskitoNumberOptionsGenerator } from '@maskito/kit'
import { useMaskito } from '@maskito/react'
import { useTranslation } from 'react-i18next'
import { decimalSeparatorForLocale, thousandSeparatorForLocale } from '@/util/i18n/i18n'
import type { BaseFieldProps } from './baseField'
import { BaseField } from './baseField'
import './field.scss'
import { without } from '@/util/util'

type NumericFieldProps = Omit<BaseFieldProps<number>, 'inputElement'> & {
  precision?: number
  thousandSeparator?: string
  decimalSeparator?: string
  decimalPseudoSeparators?: string[]
  min?: number
  max?: number
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

// eslint-disable-next-line max-lines-per-function
export const NumericField: FC<NumericFieldProps> = props => {
  const { i18n } = useTranslation()

  const {
    label,
    error,
    leftElement,
    rightElement,
    precision,
    thousandSeparator = thousandSeparatorForLocale(i18n.language),
    decimalSeparator = decimalSeparatorForLocale(i18n.language),
    decimalPseudoSeparators = without([thousandSeparator])(
      // eslint-disable-next-line react/destructuring-assignment
      props.decimalPseudoSeparators ?? [',', '.', 'ю', 'б']
    ),
    min,
    max,
    onChange,
    ...inputProps
  } = props

  const { id } = inputProps

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

  const allowedIntermediatePatterns = useMemo(
    () =>
      [decimalSeparator, ...decimalPseudoSeparators].map(
        separator => new RegExp(`\\${separator}0*$`)
      ),
    [decimalSeparator, decimalPseudoSeparators]
  )

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      if (allowedIntermediatePatterns.some(pattern => pattern.test(event.target.value))) return

      onChange?.(event)
    },
    [onChange, allowedIntermediatePatterns]
  )

  return (
    <BaseField
      {...inputProps}
      error={error}
      inputElement={
        <input
          ref={inputRef}
          {...inputProps}
          className="okp4-dataverse-portal-field-input"
          name={id}
          onInput={handleChange}
        />
      }
      label={label}
      leftElement={leftElement}
      rightElement={rightElement}
    />
  )
}
