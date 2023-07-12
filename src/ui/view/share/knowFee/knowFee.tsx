import type { FC } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/ui/store/appStore'
import './knowFee.scss'

export const KnowFee: FC = () => {
  const theme = useAppStore(store => store.theme)
  const { t } = useTranslation('share')

  return (
    <div className={classNames('okp4-dataverse-portal-share-data-know-fee-main', theme)}>
      <p>{t('share:share.dataset.knowFee')}</p>
    </div>
  )
}
