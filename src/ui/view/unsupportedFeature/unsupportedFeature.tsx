import type { FC } from 'react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/ui/component/button/button'
import { useBreakpoint } from '@/ui/hook/useBreakpoint'
import './unsupportedFeature.scss'
import '@/ui/view/unsupportedFeature/i18n/index'

export const UnsupportedFeature: FC = () => {
  const { t } = useTranslation('unsupportedFeature')

  const navigate = useNavigate()
  const handleReturnToHome = useCallback(() => navigate('/'), [navigate])

  const { isTablet } = useBreakpoint()

  return (
    <div className="okp4-dataverse-portal-unsupported-feature-main">
      <div className="okp4-dataverse-portal-unsupported-feature-content-wrapper">
        <div className="okp4-dataverse-portal-unsupported-feature-image" />
        <div className="okp4-dataverse-portal-unsupported-feature-text-container">
          <div className="okp4-dataverse-portal-unsupported-feature-titles">
            <h1 className="okp4-dataverse-portal-unsupported-feature-title">
              {t('unsupportedFeature.sorry')}
            </h1>
            {isTablet ? (
              <h1>{t('unsupportedFeature.titleTablet')}</h1>
            ) : (
              <h1>{t('unsupportedFeature.titleMobile')}</h1>
            )}
          </div>
          <p className="okp4-dataverse-portal-unsupported-feature-message">
            {t('unsupportedFeature.message')}
          </p>
        </div>
        <Button
          className="okp4-dataverse-portal-unsupported-feature-button"
          label={t('unsupportedFeature.returnToHome')}
          onClick={handleReturnToHome}
        />
      </div>
    </div>
  )
}
