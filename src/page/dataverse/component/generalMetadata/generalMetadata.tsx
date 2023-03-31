import type { FC } from 'react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import type { IconName } from '@/component/icon/icon'
import { Icon } from '@/component/icon/icon'
import './generalMetadata.scss'
import './i18n/index'

export type MetadataProperty = {
  property: string
  value: string
  iconName?: IconName
}

const GeneralMetadataItem: FC<MetadataProperty> = memo(
  ({ iconName = 'folder', property, value }) => (
    <div className="okp4-dataverse-portal-general-metadata-item-main">
      <div className="okp4-dataverse-portal-general-metadata-item-icon">
        <Icon name={iconName} />
      </div>
      <div className="okp4-dataverse-portal-general-metadata-item-content">
        <h3 className="okp4-dataverse-portal-general-metadata-item-title">{property}</h3>
        <p className="okp4-dataverse-portal-general-metadata-item-description">{value}</p>
      </div>
    </div>
  )
)
GeneralMetadataItem.displayName = 'GeneralMetadataItem'

type GeneralMetadataListProps = {
  metadata: MetadataProperty[]
}

export const GeneralMetadataList: FC<GeneralMetadataListProps> = ({ metadata }) => {
  const { t } = useTranslation('generalMetadata')

  return (
    <div className="okp4-dataverse-portal-general-metadata-list-main">
      {metadata.map(({ value, iconName, property }) => (
        <GeneralMetadataItem
          iconName={iconName}
          key={property}
          property={t(`generalMetadata.${property}`)}
          value={value}
        />
      ))}
    </div>
  )
}
