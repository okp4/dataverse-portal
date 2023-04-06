import type { FC } from 'react'
import { Tags } from '@/ui/view/dataverse/component//tags/tags'
import './itemOverview.scss'

type ItemOverviewProps = {
  type: string
  title: string
  description: string
  tags: string[]
}

const ItemOverview: FC<ItemOverviewProps> = ({ type, title, description, tags }): JSX.Element => (
  <div className="okp4-dataverse-portal-dataverse-item-overview-main">
    <div className="okp4-dataverse-portal-dataverse-item-overview-type">{type}</div>
    <h2 className="okp4-dataverse-portal-dataverse-item-overview-title">{title}</h2>
    <p className="okp4-dataverse-portal-dataverse-item-overview-description">{description}</p>
    {tags.length > 0 && <Tags tags={tags} />}
  </div>
)

export default ItemOverview
