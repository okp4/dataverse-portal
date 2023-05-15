import type { FC } from 'react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/ui/store/appStore'
import { Button } from '@/ui/component/button/button'
import '@/ui/page/error/i18n/index'
import '@/ui/page/home/i18n/index'
import './notFoundError.scss'
import '@/ui/page/error/error.scss'

export const NotFoundError: FC = () => {
  const { t } = useTranslation(['error', 'home'])
  const theme = useAppStore(store => store.theme)
  const navigate = useNavigate()

  const handleNavigateTo = useCallback((path: string) => () => navigate(path), [navigate])

  return (
    <div className={classNames('okp4-dataverse-portal-error-page-not-found-main', theme)}>
      <div className="okp4-dataverse-portal-error-page-content-wrapper">
        <div className="okp4-dataverse-portal-error-page-text-container">
          <div className="okp4-dataverse-portal-error-page-titles">
            <h1 className="okp4-dataverse-portal-error-page-title">{t('sorry')}</h1>
            <h1>{t('notFoundError.title')}</h1>
          </div>
          <p className="okp4-dataverse-portal-error-page-message">{t('notFoundError.message')}</p>
        </div>
        <div className="okp4-dataverse-portal-error-page-buttons-container">
          <Button
            className="okp4-dataverse-portal-error-page-button"
            label={t('home:home.blocks.explore.label')}
            onClick={handleNavigateTo('/dataverse')}
            variant="primary"
          />
          <Button
            className="okp4-dataverse-portal-error-page-button"
            label={t('returnToHome')}
            onClick={handleNavigateTo('/')}
          />
        </div>
      </div>
    </div>
  )
}
