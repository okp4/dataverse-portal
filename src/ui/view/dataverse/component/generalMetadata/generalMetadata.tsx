import type { FC } from 'react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import type { IconName } from '@/ui/component/icon/icon'
import { Icon } from '@/ui/component/icon/icon'
import { activeLanguageWithDefault } from '@/ui/languages/languages'
import { convertToYearIfISODateTime } from '@/util/isoDateTime/isoDateTime'
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
  const { lng } = activeLanguageWithDefault()

  return (
    <div className="okp4-dataverse-portal-general-metadata-list-main">
      {metadata.map(({ value, iconName, property }) => {
        return (
          <GeneralMetadataItem
            iconName={iconName}
            key={property}
            property={t(`generalMetadata.${property}`)}
            value={convertToYearIfISODateTime(value, lng)}
          />
        )
      })}
    </div>
  )
}
