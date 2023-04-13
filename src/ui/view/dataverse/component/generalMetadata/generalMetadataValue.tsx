import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation(namespace)
  const { value, property } = metadata

  if (isGeneralMetadata(metadata)) {
    return <span>{t(`${namespace}.${property}.value.${value}`, `${value}`)}</span>
  }

  if (isPeriodGeneralMetadata(metadata)) {
    const [startDateValue, endDateValue] = metadata.value
    return <DateInterval endDate={endDateValue} startDate={startDateValue} />
  }

  console.warn('Metadata is not of type %s: %O', 'ItemGeneralMetadata', metadata)
  return null
}
