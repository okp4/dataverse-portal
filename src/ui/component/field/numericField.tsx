import type { FC, ChangeEvent } from 'react'
import { useCallback, useMemo } from 'react'
import { maskitoNumberOptionsGenerator } from '@maskito/kit'
import { useMaskito } from '@maskito/react'
import { useTranslation } from 'react-i18next'
import {
  decimalSeparatorForLocale,
  localizedNumberFormatter,
  localizedNumberParser,
  thousandSeparatorForLocale
} from '@/util/i18n/i18n'
import { createIntermediateNumericPattern, without } from '@/util/util'
import type { BaseFieldProps } from './baseField'
import { BaseField } from './baseField'
import './field.scss'

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
  const locale = useTranslation().i18n.language

  const {
    label,
    error,
    leftElement,
    rightElement,
    precision,
    thousandSeparator = thousandSeparatorForLocale(locale),
    decimalSeparator = decimalSeparatorForLocale(locale),
    decimalPseudoSeparators = without([thousandSeparator])(
      // eslint-disable-next-line react/destructuring-assignment
      props.decimalPseudoSeparators ?? [',', '.', 'ю', 'б']
    ),
    min,
    max,
    onChange,
    ...inputProps
  } = props

  const { id, value } = inputProps

  const parseLocalizedNumber = useMemo(
    () => localizedNumberParser(locale, decimalSeparator, thousandSeparator),
    [locale, decimalSeparator, thousandSeparator]
  )

  const formatLocalizedNumber = useMemo(
    () =>
      localizedNumberFormatter(
        {
          useGrouping: true,
          minimumFractionDigits: 0,
          maximumFractionDigits: precision
        },
        locale,
        decimalSeparator,
        thousandSeparator
      ),
    [locale, decimalSeparator, thousandSeparator, precision]
  )

  const formattedValue = useMemo(
    () => (value === undefined ? '' : formatLocalizedNumber(value)),
    [value, formatLocalizedNumber]
  )

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
    () => [decimalSeparator, ...decimalPseudoSeparators].map(createIntermediateNumericPattern),
    [decimalSeparator, decimalPseudoSeparators]
  )

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const { value } = event.target

      if (allowedIntermediatePatterns.some(pattern => pattern.test(value))) return

      event.target.value = value ? String(parseLocalizedNumber(value)) : ''

      onChange?.(event)
    },
    [onChange, allowedIntermediatePatterns, parseLocalizedNumber]
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
          value={formattedValue}
        />
      }
      label={label}
      leftElement={leftElement}
      rightElement={rightElement}
      value={formattedValue}
    />
  )
}
