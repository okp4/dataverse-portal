import type { FC } from 'react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/ui/component/icon/icon'
import type { IconName } from '@/ui/component/icon/icon'
import type { ItemGeneralMetadata } from '@/ui/view/dataverse/types'
import './generalMetadata.scss'
import './i18n/index'
import { GeneralMetadataValue } from './generalMetadataValue'

type GeneralMetadataItemProps = {
  metadata: ItemGeneralMetadata
}

const propertyIcons: Record<string, IconName | undefined> = {
  topic: 'folder',
  category: 'folder',
  format: 'file',
  license: 'shield',
  geographicalCoverage: 'earth',
  temporalCoverage: 'calendar'
}

const GeneralMetadataItem: FC<GeneralMetadataItemProps> = memo(({ metadata }) => {
  const { t } = useTranslation('generalMetadata')
  const { property } = metadata

  return (
    <div className="okp4-dataverse-portal-general-metadata-item-main">
      <div className="okp4-dataverse-portal-general-metadata-item-icon">
        <Icon name={propertyIcons[property] ?? 'folder'} />
      </div>
      <div className="okp4-dataverse-portal-general-metadata-item-content">
        <h3 className="okp4-dataverse-portal-general-metadata-item-title">
          {t(`generalMetadata.${property}.property`)}
        </h3>
        <span className="okp4-dataverse-portal-general-metadata-item-value">
          <GeneralMetadataValue metadata={metadata} />
        </span>
      </div>
    </div>
  )
})
GeneralMetadataItem.displayName = 'GeneralMetadataItem'

type GeneralMetadataListProps = {
  metadata: ItemGeneralMetadata[]
}

export const GeneralMetadataList: FC<GeneralMetadataListProps> = ({ metadata }) => (
  <div className="okp4-dataverse-portal-general-metadata-list-main">
    {metadata.map(_metadata => (
      <GeneralMetadataItem key={_metadata.property} metadata={_metadata} />
    ))}
  </div>
)
