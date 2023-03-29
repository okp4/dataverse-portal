import type { FC } from 'react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import type { IconName } from '@/component/icon/icon'
import { Icon } from '@/component/icon/icon'
import './generalMetadata.scss'
import './i18n/index'

export type GeneralMetadataTitle =
  | 'format'
  | 'topic'
  | 'license'
  | 'geographical-coverage'
  | 'temporal-coverage'
  | 'category'

export type GeneralMetadata = {
  iconName: IconName
  title: GeneralMetadataTitle
  description: string
}

const GeneralMetadataItem: FC<GeneralMetadata> = memo(({ iconName, title, description }) => {
  const { t } = useTranslation('general-metadata')

  return (
    <div className="okp4-dataverse-portal-general-metadata">
      <div className="okp4-dataverse-portal-general-metadata-icon">
        <Icon name={iconName} />
      </div>
      <div className="okp4-dataverse-portal-general-metadata-content">
        <h3 className="okp4-dataverse-portal-general-metadata-title">
          {t(`general-metadata.title.${title}`)}
        </h3>
        <p className="okp4-dataverse-portal-general-metadata-description">{description}</p>
      </div>
    </div>
  )
})
GeneralMetadataItem.displayName = 'GeneralMetadataItem'

type GeneralMetadataListProps = {
  metadata: GeneralMetadata[]
}

export const GeneralMetadataList: FC<GeneralMetadataListProps> = ({ metadata }) => (
  <div className="okp4-dataverse-portal-general-metadata-list">
    {metadata.map(({ description, iconName, title }) => (
      <GeneralMetadataItem
        description={description}
        iconName={iconName}
        key={title}
        title={title}
      />
    ))}
  </div>
)
