import './generalMetadata.scss'
import type { FC } from 'react'
import type { IconName } from '@/component/icon/icon'
import { Icon } from '@/component/icon/icon'

export type GeneralMetadata = {
  iconName: IconName
  title: string
  description: string
}

const GeneralMetadataItem: FC<GeneralMetadata> = ({ iconName, title, description }) => {
  return (
    <div className="okp4-dataverse-portal-general-metadata">
      <div className="okp4-dataverse-portal-general-metadata-icon">
        <Icon name={iconName} />
      </div>
      <div className="okp4-dataverse-portal-general-metadata-content">
        <h3 className="okp4-dataverse-portal-general-metadata-title">{title}</h3>
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
}
