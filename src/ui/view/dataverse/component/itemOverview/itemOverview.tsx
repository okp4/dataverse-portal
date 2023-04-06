import type { FC } from 'react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { Tags } from '@/ui/view/dataverse/component//tags/tags'
import './itemOverview.scss'

type ItemOverviewProps = {
  type: DataverseItem
  title: string
  description: string
  tags: string[]
}
type DataverseItem = 'dataspace' | 'dataset' | 'service'
type ColorVariant = 'primary-color' | 'primary-color-variant-3' | 'primary-color-variant-4'

const ItemOverview: FC<ItemOverviewProps> = ({ type, title, description, tags }): JSX.Element => {
  const { t } = useTranslation('common')

  const renderItemTypeColor = useCallback((type: DataverseItem): ColorVariant => {
    switch (type) {
      case 'service':
        return 'primary-color'
      case 'dataspace':
        return 'primary-color-variant-3'
      case 'dataset':
        return 'primary-color-variant-4'
    }
  }, [])

  return (
    <div className="okp4-dataverse-portal-dataverse-item-overview-main">
      <h3
        className={classNames(
          'okp4-dataverse-portal-dataverse-item-overview-type',
          renderItemTypeColor(type)
        )}
      >
        {t(`resources.${type}`)}
      </h3>
      <h2 className="okp4-dataverse-portal-dataverse-item-overview-title">{title}</h2>
      <p className="okp4-dataverse-portal-dataverse-item-overview-description">{description}</p>
      {tags.length > 0 && <Tags tags={tags} />}
    </div>
  )
}

export default ItemOverview
