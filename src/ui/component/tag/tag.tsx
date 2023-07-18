import { type FC } from 'react'
import { Icon } from '@/ui/component/icon/icon'
import './tag.scss'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

type TagProps = {
  tagName: string
  classes?: { main?: string; name?: string; icon?: string }
  onDelete?: () => void
}

export const Tag: FC<TagProps> = ({ tagName, onDelete, classes }) => {
  const { t } = useTranslation('common')
  const { main, name, icon } = classes ?? {}

  return (
    <div className={classNames('okp4-dataverse-portal-tag-main', main)}>
      <div className={classNames('okp4-dataverse-portal-tag-name', name)}>{tagName}</div>
      {onDelete && (
        <div
          className={classNames('okp4-dataverse-portal-tag-icon', icon)}
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
