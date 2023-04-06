import type { FC } from 'react'
import './itemOverview.scss'

type ItemOverviewProps = {
  type: string
  title: string
  description: string
}

const ItemOverview: FC<ItemOverviewProps> = ({ type, title, description }): JSX.Element => (
  <>
    <div className="okp4-dataverse-portal-dataverse-item-overview-type">{type}</div>
    <div className="okp4-dataverse-portal-dataverse-item-overview-title">{title}</div>
    <div className="okp4-dataverse-portal-dataverse-item-overview-description">{description}</div>
  </>
)

export default ItemOverview
