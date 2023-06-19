import classNames from 'classnames'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/ui/component/icon/icon'
import type { IconName } from '@/ui/component/icon/icon'
import './noResulFound.scss'

type NoResultsFoundProps = {
  iconName: IconName
  className?: string
}

export const NoResultFound: FC<NoResultsFoundProps> = ({
  iconName,
  className
}: NoResultsFoundProps) => {
  const { t } = useTranslation('common')

  return (
    <div className={classNames('okp4-dataverse-portal-no-results', className)}>
      <Icon name={iconName} />
      <span>{t('noResultsFound')}</span>
    </div>
  )
}
