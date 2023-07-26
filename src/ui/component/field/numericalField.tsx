import { useCallback, useMemo } from 'react'
import * as O from 'fp-ts/Option'
import * as S from 'fp-ts/string'
import { pipe, flow } from 'fp-ts/function'
import type { FieldProps } from '@/ui/component/field/field'
import { Field } from '@/ui/component/field/field'
import { isValidNumberFieldFormat } from '@/util/field/field'
import { formatLocalizedNumber } from '@/util/i18n/i18n'
import { endsZeroDotted } from '@/util/util'

type NumericalFieldProps = FieldProps & {
  onChange: (value: string) => void
}

const coinDecimal = APP_ENV.chains[0].feeCurrencies[0].coinDecimals

// eslint-disable-next-line max-lines-per-function
export const NumericalField: React.FC<NumericalFieldProps> = props => {
  const { onChange, value } = props

  const thousandSeparator = '\u202F' // narrow no-break space
  const decimalSeparator = '.'

  const intlFormatConfig = useMemo(
    () => ({
      locale: 'fr-FR',
      decimalSeparator,
      options: {
        useGrouping: true,
        minimumFractionDigits: 0,
        maximumFractionDigits: coinDecimal
      }
    }),
    []
  )

  const numberFieldValidationConfig = useMemo(
    () => ({
      thousandSeparator,
      decimalSeparator,
      decimalLimit: coinDecimal
    }),
    []
  )

  const handleInputChange = useCallback(
    (value: string) => {
      pipe(
        value,
        S.replace(',', decimalSeparator),
        S.replace(new RegExp(thousandSeparator, 'g'), ''),
        isValidNumberFieldFormat(numberFieldValidationConfig),
        O.map(validValue =>
          pipe(
            validValue,
            O.fromPredicate(s => S.isEmpty(s) || s.endsWith('.') || endsZeroDotted(s)),
            O.map(flow(onChange)),
            O.getOrElse(() =>
              pipe(validValue, parseFloat, formatLocalizedNumber(intlFormatConfig), onChange)
            )
          )
        )
      )
    },
    [onChange, intlFormatConfig, numberFieldValidationConfig]
  )

  return <Field {...props} onChange={handleInputChange} value={value} />
}
