import type { FC } from 'react'
import { Card } from '@/ui/component/card/card'
import { useTranslation } from 'react-i18next'
import './share.scss'
import './i18n/index'

export const Share: FC = () => {
  const { t } = useTranslation('share')

  return (
    <div className="okp4-dataverse-portal-share-page-main">
      <Card mainClassName="okp4-dataverse-portal-share-page-card left">
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
  )
}
