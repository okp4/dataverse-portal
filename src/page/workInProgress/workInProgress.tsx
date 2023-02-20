import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import './workInProgress.scss'
import './i18n/index'

export const WorkInProgress: FC = () => {
  const { t } = useTranslation('workInProgress')
  return (
    <div className="okp4-dataverse-portal-work-in-progress-main">
      <h1>{t('workInProgress.title')}</h1>
      <p>{t('workInProgress.description')}</p>
    </div>
  )
}
