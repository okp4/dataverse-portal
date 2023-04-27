import type { FC } from 'react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/ui/store/appStore'
import { Button } from '@/ui/component/button/button'
import '@/ui/page/internalError/i18n/index'
import './internalError.scss'

export const InternalError: FC = () => {
  const { t } = useTranslation('internalError')
  const theme = useAppStore(store => store.theme)
  const navigate = useNavigate()

  const handleBackToHomeClick = useCallback((): void => navigate('/'), [navigate])
  const handleContactClick = useCallback(() => {
    window.open(APP_ENV.urls['form:error'], '_blank')
  }, [])

  return (
    <div className={classNames('okp4-dataverse-portal-internal-error-page-main', theme)}>
      <div className="okp4-dataverse-portal-internal-error-page-content-wrapper">
        <div className="okp4-dataverse-portal-internal-error-page-text-wrapper">
          <div className="okp4-dataverse-portal-internal-error-page-message-titles">
            <h1 className="okp4-dataverse-portal-internal-error-page-message-apology">
              {t('internalError.apology')}
            </h1>
            <h1>{t('internalError.message')}</h1>
          </div>
          <p className="okp4-dataverse-portal-internal-error-page-message-suggestion">
            {t('internalError.suggestion')}
          </p>
        </div>
        <div className="okp4-dataverse-portal-internal-error-page-buttons-container">
          <Button
            className="okp4-dataverse-portal-internal-error-page-button"
            label={t('internalError.returnToHome')}
            onClick={handleBackToHomeClick}
            variant="quaternary-turquoise"
          />
          <Button
            className="okp4-dataverse-portal-internal-error-page-button"
            label={t('internalError.contactUs')}
            onClick={handleContactClick}
            variant="outlined-tertiary"
          />
        </div>
      </div>
    </div>
  )
}
