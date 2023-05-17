import type { FC } from 'react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/ui/store/appStore'
import { Button } from '@/ui/component/button/button'
import { routes } from '@/ui/routes'
import '@/ui/page/error/i18n/index'
import './internalError.scss'
import '@/ui/page/error/error.scss'

export const InternalError: FC = () => {
  const { t } = useTranslation('error')
  const theme = useAppStore(store => store.theme)
  const navigate = useNavigate()

  const handleNavigateTo = useCallback((path: string) => () => navigate(path), [navigate])
  const handleContactClick = useCallback(() => {
    window.open(APP_ENV.urls['form:error'], '_blank')
  }, [])

  return (
    <div className={classNames('okp4-dataverse-portal-error-page-internal-main', theme)}>
      <div className="okp4-dataverse-portal-error-page-content-wrapper">
        <div className="okp4-dataverse-portal-error-page-text-container">
          <div className="okp4-dataverse-portal-error-page-titles">
            <h1 className="okp4-dataverse-portal-error-page-title">{t('sorry')}</h1>
            <h1>{t('internalError.title')}</h1>
          </div>
          <p className="okp4-dataverse-portal-error-page-message">{t('internalError.message')}</p>
        </div>
        <div className="okp4-dataverse-portal-error-page-buttons-container">
          <Button
            className="okp4-dataverse-portal-error-page-button"
            label={t('returnToHome')}
            onClick={handleNavigateTo(routes.home)}
            variant="quaternary-turquoise"
          />
          <Button
            className="okp4-dataverse-portal-error-page-button"
            label={t('internalError.contactUs')}
            onClick={handleContactClick}
            variant="outlined-tertiary"
          />
        </div>
      </div>
    </div>
  )
}
