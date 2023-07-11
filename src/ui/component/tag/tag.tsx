import { useCallback, type FC } from 'react'
import { Icon } from '@/ui/component/icon/icon'
import './tag.scss'
import { useTranslation } from 'react-i18next'

type TagProps = {
  tagName: string
  onDelete?: () => void
}

export const Tag: FC<TagProps> = ({ tagName, onDelete }) => {
  const { t } = useTranslation('common')
  const handleDelete = useCallback(() => {
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
          onClick={handleDelete}
          role="button"
          tabIndex={0}
          title={t('actions.delete')}
        >
          <Icon name="close-dark" />
        </div>
      )}
    </div>
  )
}
