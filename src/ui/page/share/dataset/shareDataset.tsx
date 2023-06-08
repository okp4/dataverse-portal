import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import '../i18n/index'
import './shareDataset.scss'

import { ServiceStorageSelection } from './steps/serviceStorageSelection/serviceStorageSelection'

export const ShareDataset: FC = () => {
  const { t } = useTranslation('share')

  return (
    <div className="okp4-dataverse-portal-share-dataset-page-main">
      <h1>{t('share.dataset.title')}</h1>
      <ServiceStorageSelection />
    </div>
  )
}
