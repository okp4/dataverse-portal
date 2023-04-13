import type { FC } from 'react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/ui/store/appStore'
import '../i18n/index'
import './notFoundError.scss'
import { Button } from '@/ui/component/button/button'

export const NotFoundError: FC = () => {
  const { t } = useTranslation('error')
  const navigate = useNavigate()
  const theme = useAppStore(store => store.theme)

  const backToDataverse = useCallback((): void => navigate('/dataverse'), [navigate])
  const backToHome = useCallback((): void => navigate('/'), [navigate])

  return (
    <div className={classNames('okp4-dataverse-portal-not-found-error-page-main', theme)}>
      <div className="okp4-dataverse-portal-not-found-error-page-content-wrapper">
        <div className="okp4-dataverse-portal-not-found-error-page-message-titles">
          <h1 className="okp4-dataverse-portal-not-found-error-page-message-apology">
            {t('error.notFoundError.apology')}
          </h1>
          <h1>{t('error.notFoundError.message')}</h1>
        </div>
        <p className="okp4-dataverse-portal-not-found-error-page-message-suggestion">
          {t('error.notFoundError.suggestion')}
        </p>
        <div className="okp4-dataverse-portal-not-found-error-page-button-container">
          <Button
            className="okp4-dataverse-portal-not-found-error-page-button"
            label={t('error.notFoundError.dataverseButton')}
            onClick={backToDataverse}
            size="small"
            variant="primary"
          />
          <Button
            className="okp4-dataverse-portal-not-found-error-page-button"
            label={t('error.notFoundError.homeButton')}
            onClick={backToHome}
            size="small"
            variant="secondary"
          />
        </div>
      </div>
    </div>
  )
}
