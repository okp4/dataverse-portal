import type { FC } from 'react'
import { useCallback } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/ui/store/appStore'
import '../i18n/index'
import './renderingError.scss'
import { Button } from '@/ui/component/button/button'

export const RenderingError: FC = () => {
  const { t } = useTranslation('error')
  const theme = useAppStore(store => store.theme)

  const handleContactClick = useCallback(() => {
    window.open(APP_ENV.urls['form:feedback'], '_blank')
  }, [])

  const handleRefreshClick = useCallback(() => {
    window.location.reload()
  }, [])

  return (
    <div className={classNames('okp4-dataverse-portal-rendering-error-page-main', theme)}>
      <div className="okp4-dataverse-portal-rendering-error-page-content-wrapper">
        <div className="okp4-dataverse-portal-rendering-error-page-message-titles">
          <h1 className="okp4-dataverse-portal-rendering-error-page-message-apology">
            {t('error.renderingError.apology')}
          </h1>
          <h1>{t('error.renderingError.message')}</h1>
        </div>
        <p className="okp4-dataverse-portal-rendering-error-page-message-suggestion">
          {t('error.renderingError.suggestion')}
        </p>
        <div className="okp4-dataverse-portal-rendering-error-page-button-container">
          <Button
            className="okp4-dataverse-portal-rendering-error-page-button"
            label={t('error.renderingError.refreshButton')}
            onClick={handleRefreshClick}
            size="small"
            variant="primary"
          />
          <Button
            className="okp4-dataverse-portal-rendering-error-page-button"
            label={t('error.renderingError.contactButton')}
            onClick={handleContactClick}
            size="small"
            variant="outlined-tertiary"
          />
        </div>
      </div>
    </div>
  )
}
