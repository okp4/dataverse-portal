import { useTranslation } from 'react-i18next'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import { fromPredicate } from 'fp-ts/lib/Either'
import type { ItemGeneralMetadata } from '@/ui/view/dataverse/types'
import './generalMetadata.scss'
import './i18n/index'
import { convertToLocalizedDateIfISODateTime } from '@/util/isoDateTime/isoDateTime'
import { DateFromTo } from './dateFromTo'

const isPeriodGeneralMetadata = (
  metadata: ItemGeneralMetadata
): metadata is ItemGeneralMetadata & { property: 'period'; value: [string, string] } =>
  metadata.property === 'period'

const isGeneralMetadata = (
  metadata: ItemGeneralMetadata
): metadata is ItemGeneralMetadata & { value: string } => metadata.property !== 'period'

const maybeLocalizedDate = (date: string, lng: string): string | undefined =>
  pipe(
    convertToLocalizedDateIfISODateTime(date, lng),
    E.fold(
      (error: Error) => {
        console.error(error.message)
        return undefined
      },
      (localizedDate: string) => localizedDate
    )
  )

type MetadataValueProps = {
  metadata: ItemGeneralMetadata
  lng: string
}

export const GeneralMetadataValue = ({ metadata, lng }: MetadataValueProps): JSX.Element | null => {
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

    return (
      <DateFromTo
        endISODate={maybeLocalizedDate(endDateValue, lng)}
        startISODate={maybeLocalizedDate(startDateValue, lng)}
      />
    )
  }

  console.warn('Metadata is not of type ItemGeneralMetadata')
  return null
}
