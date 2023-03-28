import './resourceDetails.scss'
import type { FC } from 'react'

type ResourceDetailsProps = {
  icon: JSX.Element
  title: string
  description: string
}

export const ResourceDetails: FC<ResourceDetailsProps> = ({ icon, title, description }) => {
  return (
    <div className="okp4-dataverse-portal-resource-details">
      <div className="okp4-dataverse-portal-resource-details-icon">{icon}</div>
      <div className="okp4-dataverse-portal-resource-details-content">
        <h3 className="okp4-dataverse-portal-resource-details-title">{title}</h3>
        <p className="okp4-dataverse-portal-resource-details-description">{description}</p>
      </div>
    </div>
  )
}
