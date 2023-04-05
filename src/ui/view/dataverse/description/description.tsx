import type { FC } from 'react'
import './description.scss'

type DescriptionProps = {
  type: string
  title: string
  description: string
}

const DataverseItemDescription: FC<DescriptionProps> = ({
  type,
  title,
  description
}): JSX.Element => (
  <>
    <div className="okp4-dataverse-portal-dataverse-item-description-type">{type}</div>
    <div className="okp4-dataverse-portal-dataverse-item-description-title">{title}</div>
    <div className="okp4-dataverse-portal-dataverse-item-description-description">
      {description}
    </div>
  </>
)

export default DataverseItemDescription
