import type { FC } from 'react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/ui/store/appStore'
import { Button } from '@/ui/component/button/button'
import '@/ui/page/notFoundError/i18n/index'
import '@/ui/page/home/i18n/index'
import './notFoundError.scss'

export const NotFoundError: FC = () => {
  const { t } = useTranslation(['notFoundError', 'home'])
  const navigate = useNavigate()
  const theme = useAppStore(store => store.theme)

  const backToDataverse = useCallback((): void => navigate('/dataverse'), [navigate])
  const backToHome = useCallback((): void => navigate('/'), [navigate])

  return (
    <div className={classNames('okp4-dataverse-portal-not-found-error-page-main', theme)}>
      <div className="okp4-dataverse-portal-not-found-error-page-content-wrapper">
        <div className="okp4-dataverse-portal-not-found-error-page-text-wrapper">
          <div className="okp4-dataverse-portal-not-found-error-page-message-titles">
            <h1 className="okp4-dataverse-portal-not-found-error-page-message-apology">
              {t('notFoundError.apology')}
            </h1>
            <h1>{t('notFoundError.message')}</h1>
          </div>
          <p className="okp4-dataverse-portal-not-found-error-page-message-suggestion">
            {t('notFoundError.suggestion')}
          </p>
        </div>
        <div className="okp4-dataverse-portal-not-found-error-page-button-container">
          <Button
            className="okp4-dataverse-portal-not-found-error-page-button"
            label={t('home:home.blocks.explore.label')}
            onClick={backToDataverse}
            variant="primary"
          />
          <Button
            className="okp4-dataverse-portal-not-found-error-page-button"
            label={t('notFoundError.backToHome')}
            onClick={backToHome}
          />
        </div>
      </div>
    </div>
  )
}
