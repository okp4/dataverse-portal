import { useCallback, useMemo } from 'react'
import * as O from 'fp-ts/Option'
import * as S from 'fp-ts/string'
import { pipe, flow } from 'fp-ts/function'
import type { FieldProps } from '@/ui/component/field/field'
import { Field } from '@/ui/component/field/field'
import { localizedNumberFormatter } from '@/util/i18n/i18n'
import { endsZeroDotted, numberFormatValidator } from '@/util/util'

type NumericalFieldProps = FieldProps & Required<Pick<FieldProps, 'onChange'>>

const coinDecimal = APP_ENV.chains[0].feeCurrencies[0].coinDecimals

// eslint-disable-next-line max-lines-per-function
export const NumericalField: React.FC<NumericalFieldProps> = props => {
  const { onChange, value } = props

  const thousandSeparator = '\u202F' // narrow no-break space
  const decimalSeparator = '.'

  const formatLocalizedNumber = useMemo(
    () =>
      localizedNumberFormatter(
        'fr-FR',
        {
          useGrouping: true,
          minimumFractionDigits: 0,
          maximumFractionDigits: coinDecimal
        },
        decimalSeparator
      ),
    []
  )

  const validateNumberFormat = useMemo(
    () => numberFormatValidator(thousandSeparator, decimalSeparator, coinDecimal),
    []
  )

  const handleInputChange = useCallback(
    (value: string) => {
      pipe(
        value,
        S.replace(',', decimalSeparator),
        S.replace(new RegExp(thousandSeparator, 'g'), ''),
        validateNumberFormat,
        O.map(validValue =>
          pipe(
            validValue,
            O.fromPredicate(s => S.isEmpty(s) || s.endsWith('.') || endsZeroDotted(s)),
            O.map(flow(onChange)),
            O.getOrElse(() => pipe(validValue, parseFloat, formatLocalizedNumber, onChange))
          )
        )
      )
    },
    [onChange, formatLocalizedNumber, validateNumberFormat]
  )

  return <Field {...props} onChange={handleInputChange} value={value} />
}
