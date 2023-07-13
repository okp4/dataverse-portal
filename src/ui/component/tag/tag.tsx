import { type FC } from 'react'
import { Icon } from '@/ui/component/icon/icon'
import './tag.scss'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

type TagProps = {
  tagName: string
  className?: string
  onDelete?: () => void
}

export const Tag: FC<TagProps> = ({ tagName, onDelete, className }) => {
  const { t } = useTranslation('common')

  return (
    <div className={classNames('okp4-dataverse-portal-tag-main', className)}>
      <div className="okp4-dataverse-portal-tag-name">{tagName}</div>
      {onDelete && (
        <div
          className="okp4-dataverse-portal-tag-icon"
          onClick={onDelete}
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
