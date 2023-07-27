import { useCallback, useMemo } from 'react'
import * as O from 'fp-ts/Option'
import * as S from 'fp-ts/string'
import { pipe, flow } from 'fp-ts/function'
import type { FieldProps } from '@/ui/component/field/field'
import { Field } from '@/ui/component/field/field'
import {
  decimalSeparatorForLocale,
  localizedNumberFormatter,
  thousandSeparatorForLocale
} from '@/util/i18n/i18n'
import { endsWithDecimalSeparatorAndZeros, escapeRegExp, numberFormatValidator } from '@/util/util'

type NumericalFieldProps = FieldProps &
  Required<Pick<FieldProps, 'onChange'>> & {
    locale?: string
    decimalSeparator?: '.' | ','
    decimalLimit?: number
  }

// eslint-disable-next-line max-lines-per-function
export const NumericalField: React.FC<NumericalFieldProps> = props => {
  const { onChange, value, locale = 'fr-FR', decimalSeparator, decimalLimit = 2 } = props

  const thousandSeparator = thousandSeparatorForLocale(locale)

  if (thousandSeparator === decimalSeparator) {
    throw new Error(
      `Both 'thousandSeparator' and 'decimalSeparator' are set to '${thousandSeparator}' and they must be different for locale '${locale}'.\nEither set decimalSeparator to '${
        decimalSeparator === '.' ? ',' : '.'
      }' or change the locale.`
    )
  }

  const formatLocalizedNumber = useMemo(
    () =>
      localizedNumberFormatter(
        locale,
        {
          useGrouping: true,
          minimumFractionDigits: 0,
          maximumFractionDigits: decimalLimit
        },
        decimalSeparator
      ),
    [locale, decimalSeparator, decimalLimit]
  )

  const validateNumberFormat = useMemo(
    () =>
      numberFormatValidator(
        thousandSeparator,
        decimalSeparator ?? decimalSeparatorForLocale(locale),
        decimalLimit
      ),
    [thousandSeparator, decimalLimit, decimalSeparator, locale]
  )

  const handleInputChange = useCallback(
    (value: string) => {
      pipe(
        value,
        S.replace(new RegExp(escapeRegExp(thousandSeparator), 'g'), ''),
        S.replace(decimalSeparatorForLocale(locale), decimalSeparator ?? '$&'),
        validateNumberFormat,
        O.map(validValue =>
          pipe(
            validValue,
            O.fromPredicate(
              s =>
                S.isEmpty(s) ||
                s.endsWith(decimalSeparator ?? decimalSeparatorForLocale(locale)) ||
                endsWithDecimalSeparatorAndZeros(s)
            ),
            O.map(flow(onChange)),
            O.getOrElse(() =>
              pipe(validValue, S.replace(',', '.'), parseFloat, formatLocalizedNumber, onChange)
            )
          )
        )
      )
    },
    [
      onChange,
      locale,
      formatLocalizedNumber,
      validateNumberFormat,
      decimalSeparator,
      thousandSeparator
    ]
  )

  return <Field {...props} onChange={handleInputChange} value={value} />
}
