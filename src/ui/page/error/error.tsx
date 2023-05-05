/* eslint-disable max-lines-per-function */
import type { FC } from 'react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/ui/store/appStore'
import { Button } from '@/ui/component/button/button'
import '@/ui/page/error/i18n/index'
import './error.scss'

type ErrorProps = {
  type: 'notFoundError' | 'internalError'
}

export const Error: FC<ErrorProps> = ({ type }) => {
  const { t } = useTranslation('error')
  const navigate = useNavigate()
  const theme = useAppStore(store => store.theme)

  const navigateTo = useCallback((path: string) => () => navigate(path), [navigate])
  const handleContactClick = useCallback(() => {
    window.open(APP_ENV.urls['form:error'], '_blank')
  }, [])

  return (
    <div className={classNames('okp4-dataverse-portal-error-page-main', theme, type)}>
      <div className="okp4-dataverse-portal-error-page-content-wrapper">
        <div className="okp4-dataverse-portal-error-page-text-wrapper">
          <div className="okp4-dataverse-portal-error-page-message-titles">
            <h1 className="okp4-dataverse-portal-error-page-message-apology">
              {t(`${type}.apology`)}
            </h1>
            <h1>{t(`${type}.message`)}</h1>
          </div>
          <p className="okp4-dataverse-portal-error-page-message-suggestion">
            {t(`${type}.suggestion`)}
          </p>
        </div>

        {type == 'notFoundError' ? (
          <div className="okp4-dataverse-portal-error-page-buttons-container">
            <Button
              className="okp4-dataverse-portal-error-page-button"
              label={t(`${type}.buttonLeft`)}
              onClick={navigateTo('/dataverse')}
              variant="primary"
            />
            <Button
              className="okp4-dataverse-portal-error-page-button"
              label={t(`${type}.buttonRight`)}
              onClick={navigateTo('/')}
            />
          </div>
        ) : (
          <div className="okp4-dataverse-portal-error-page-buttons-container">
            <Button
              className="okp4-dataverse-portal-error-page-button"
              label={t(`${type}.buttonLeft`)}
              onClick={navigateTo('/')}
              variant="quaternary-turquoise"
            />
            <Button
              className="okp4-dataverse-portal-error-page-button"
              label={t(`${type}.buttonRight`)}
              onClick={handleContactClick}
              variant="outlined-tertiary"
            />
          </div>
        )}
      </div>
    </div>
  )
}
