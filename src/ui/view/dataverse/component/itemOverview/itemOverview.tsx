import type { FC } from 'react'
import { Tags } from '@/ui/view/dataverse/component//tags/tags'
import './itemOverview.scss'
import { useTranslation } from 'react-i18next'

type ItemOverviewProps = {
  type: string
  title: string
  description: string
  tags: string[]
}

const ItemOverview: FC<ItemOverviewProps> = ({ type, title, description, tags }): JSX.Element => {
  const { t } = useTranslation('common')
  return (
    <div className="okp4-dataverse-portal-dataverse-item-overview-main">
      <div className="okp4-dataverse-portal-dataverse-item-overview-type">
        {t(`resources.${type}`)}
      </div>
      <h2 className="okp4-dataverse-portal-dataverse-item-overview-title">{title}</h2>
      <p className="okp4-dataverse-portal-dataverse-item-overview-description">{description}</p>
      {tags.length > 0 && <Tags tags={tags} />}
    </div>
  )
}

export default ItemOverview
