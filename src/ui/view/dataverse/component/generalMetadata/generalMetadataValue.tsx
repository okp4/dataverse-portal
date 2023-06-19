import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { ItemGeneralMetadata } from '@/ui/view/dataverse/types'
import { isGeneralMetadataWithIcon } from '@/ui/view/dataverse/component/dataverseItemDetails/detailedDataverseItem'
import './generalMetadata.scss'
import './i18n/index'
import { DateInterval } from './dateInterval'

const isPeriodGeneralMetadata = (
  metadata: ItemGeneralMetadata
): metadata is Omit<ItemGeneralMetadata, 'value'> & {
  property: 'period'
  value: [string, string]
} => metadata.property === 'period'

type MetadataValueProps = {
  metadata: ItemGeneralMetadata
}

export const GeneralMetadataValue: FC<MetadataValueProps> = ({ metadata }) => {
  const namespace = 'generalMetadata'
  const { t } = useTranslation(namespace)
  const { value, property } = metadata

  if (isPeriodGeneralMetadata(metadata)) {
    const [startDateValue, endDateValue] = metadata.value
    return <DateInterval endDate={endDateValue} startDate={startDateValue} />
  }

  if (isGeneralMetadataWithIcon(metadata)) {
    return <span>{t(`${namespace}.${property}.value.${value}`, `${value}`)}</span>
  }

  console.warn('Metadata is not of type %s: %O', 'ItemGeneralMetadata', metadata)
  return null
}
