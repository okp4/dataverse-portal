import { useTranslation } from 'react-i18next'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import { fromPredicate } from 'fp-ts/lib/Either'
import type { ItemGeneralMetadata } from '@/ui/view/dataverse/types'
import './generalMetadata.scss'
import './i18n/index'
import { DateInterval } from './dateInterval'

const isPeriodGeneralMetadata = (
  metadata: ItemGeneralMetadata
): metadata is ItemGeneralMetadata & { property: 'period'; value: [string, string] } =>
  metadata.property === 'period'

const isGeneralMetadata = (
  metadata: ItemGeneralMetadata
): metadata is ItemGeneralMetadata & { value: string } => metadata.property !== 'period'

type MetadataValueProps = {
  metadata: ItemGeneralMetadata
}

export const GeneralMetadataValue = ({ metadata }: MetadataValueProps): JSX.Element | null => {
  const namespace = 'generalMetadata'
  const { t, i18n } = useTranslation(namespace)
  const { value, property } = metadata
  if (isGeneralMetadata(metadata)) {
    const translationKeyExists = i18n.exists(`${namespace}.topic.value.${value}`, {
      ns: namespace,
      lng: i18n.language
    })
    const translatedValue = pipe(
      value,
      fromPredicate(
        () => translationKeyExists,
        () => value
      ),
      E.map(val => t(`${namespace}.${property}.value.${val}`)),
      E.getOrElse(() => value)
    )
    return <span>{translatedValue}</span>
  }

  if (isPeriodGeneralMetadata(metadata)) {
    const [startDateValue, endDateValue] = metadata.value
    return <DateInterval endDate={endDateValue} startDate={startDateValue} />
  }

  console.warn('Metadata is not of type ItemGeneralMetadata')
  return null
}
