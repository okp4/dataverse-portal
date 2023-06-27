import type { FC } from 'react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/ui/component/card/card'
import { useBreakpoint } from '@/ui/hook/useBreakpoint'
import { UnsupportedFeature } from '@/ui/view/unsupportedFeature/unsupportedFeature'
import { routes } from '@/ui/routes'
import './share.scss'
import './i18n/index'

export const Share: FC = () => {
  const { t } = useTranslation('share')
  const navigate = useNavigate()

  const { isTablet, isMobile } = useBreakpoint()

  const handleShareDataset = useCallback(() => {
    navigate(routes.shareDataset)
  }, [navigate])

  return (
    <div className="okp4-dataverse-portal-share-page-main">
      {isTablet || isMobile ? (
        <UnsupportedFeature />
      ) : (
        <div className="okp4-dataverse-portal-share-page-content">
          <Card
            mainClassName="okp4-dataverse-portal-share-page-card left"
            onClick={handleShareDataset}
          >
            <>
              <div className="okp4-dataverse-portal-share-page-ilustration" />
              <div className="okp4-dataverse-portal-share-page-text-container">
                <h3>{t('share.dataset.title')}</h3>
                <p>{t('share.dataset.description')}</p>
              </div>
            </>
          </Card>
          <Card mainClassName="okp4-dataverse-portal-share-page-card right">
            <>
              <div className="okp4-dataverse-portal-share-page-ilustration" />
              <div className="okp4-dataverse-portal-share-page-text-container">
                <h3>{t('share.service.title')}</h3>
                <p>{t('share.service.description')}</p>
                <h3 className="okp4-dataverse-portal-share-page-text-disabled">
                  {t('share.soonAvailable')}
                </h3>
              </div>
            </>
          </Card>
        </div>
      )}
    </div>
  )
}
