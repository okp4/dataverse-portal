import { useCallback, type FC } from 'react'
import { Icon } from '../icon/icon'

import './tag.scss'

type TagProps = {
  tagName: string
  onDelete?: () => void
}

export const Tag: FC<TagProps> = ({ tagName, onDelete }) => {
  const handleClick = useCallback(() => {
    if (onDelete) {
      onDelete()
    }
  }, [onDelete])

  return (
    <div className="okp4-dataverse-portal-tag-main">
      <div className="okp4-dataverse-portal-tag-name">{tagName}</div>
      {onDelete && (
        <div
          className="okp4-dataverse-portal-tag-icon"
          onClick={handleClick}
          role="button"
          tabIndex={0}
          title="close"
        >
          <Icon name="close-dark" />
        </div>
      )}
    </div>
  )
}
