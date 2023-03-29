import './generalMetadata.scss'
import type { FC } from 'react'
import type { IconName } from '@/component/icon/icon'
import { Icon } from '@/component/icon/icon'
import { useTranslation } from 'react-i18next'

export type GeneralMetadataTitleKey =
  | 'format'
  | 'topic'
  | 'license'
  | 'geographical-coverage'
  | 'temporal-coverage'
  | 'category'

export type GeneralMetadata = {
  iconName: IconName
  titleKey: GeneralMetadataTitleKey
  description: string
}

const GeneralMetadataItem: FC<GeneralMetadata> = ({ iconName, titleKey, description }) => {
  const { t } = useTranslation('common')

  return (
    <div className="okp4-dataverse-portal-general-metadata">
      <div className="okp4-dataverse-portal-general-metadata-icon">
        <Icon name={iconName} />
      </div>
      <div className="okp4-dataverse-portal-general-metadata-content">
        <h3 className="okp4-dataverse-portal-general-metadata-title">
          {t(`resources.general-metadata.${titleKey}`)}
        </h3>
        <p className="okp4-dataverse-portal-general-metadata-description">{description}</p>
      </div>
    </div>
  )
}

type GeneralMetadataListProps = {
  metadata: GeneralMetadata[]
}

export const GeneralMetadataList: FC<GeneralMetadataListProps> = ({ metadata }) => {
  return (
    <div className="okp4-dataverse-portal-general-metadata-list">
      {metadata.map(({ description, iconName, titleKey }) => (
        <GeneralMetadataItem
          description={description}
          iconName={iconName}
          key={titleKey}
          titleKey={titleKey}
        />
      ))}
    </div>
  )
}
