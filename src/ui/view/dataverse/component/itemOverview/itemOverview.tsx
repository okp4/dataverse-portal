import type { FC } from 'react'
import { Tags } from '@/ui/view/dataverse/component//tags/tags'
import { Icon } from '@/ui/component/icon/icon'
import { useAppStore } from '@/ui/store/index'
import './itemOverview.scss'

type ItemOverviewProps = {
  title: string
  description: string
  tags: string[]
  onClose?: () => void
}

const ItemOverview: FC<ItemOverviewProps> = ({
  title,
  description,
  tags,
  onClose
}): JSX.Element => {
  const theme = useAppStore(store => store.theme)
  return (
    <div className="okp4-dataverse-portal-dataverse-item-overview-main">
      <h2 className="okp4-dataverse-portal-dataverse-item-overview-title">
        <span>{title}</span>
        {!!onClose && (
          <div className="okp4-dataverse-portal-dataverse-item-overview-close" onClick={onClose}>
            <Icon name={`close-${theme}`} />
          </div>
        )}
      </h2>
      <p className="okp4-dataverse-portal-dataverse-item-overview-description">{description}</p>
      {tags.length > 0 && <Tags tags={tags} />}
    </div>
  )
}

export default ItemOverview
