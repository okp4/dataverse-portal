import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/ui/component/card/card'
import { Icon } from '@/ui/component/icon/icon'
import { useAppStore } from '@/ui/store/appStore'
import { activeLanguageWithDefault } from '@/ui/languages/languages'
import './dataversItemStatCard.scss'

type DataverseItemStatCardProps = {
  type: 'dataset' | 'service'
  amount: number
  lastUpdated: string
}

export const DataverseItemStatCard = ({
  type,
  amount,
  lastUpdated
}: DataverseItemStatCardProps): JSX.Element => {
  const { t } = useTranslation('common')
  const theme = useAppStore(store => store.theme)
  const currentLng = activeLanguageWithDefault().lng

  const localisedLastUpdate = useMemo(() => {
    const dateTimeFormat = new Intl.DateTimeFormat(currentLng, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    const lastUpdateDate = new Date(lastUpdated)
    return dateTimeFormat.format(lastUpdateDate).replaceAll(/[.,]/g, '')
  }, [lastUpdated, currentLng])

  return (
    <Card mainClassName="okp4-dataverse-portal-data-space-details-dataverse-item-stat-card-main">
      <>
        <div className="okp4-dataverse-portal-data-space-details-dataverse-item-stat-card-description">
          <div className="okp4-dataverse-portal-data-space-details-dataverse-item-stat-card-icon-wrapper">
            <Icon name={`${type}-folder-${theme}`} />
          </div>
          <div>
            <p className="okp4-dataverse-portal-data-space-details-dataverse-item-stat-card-type">
              {t(`resources.${type === 'dataset' ? 'datasets' : 'services'}`)}
            </p>
            <div className="okp4-dataverse-portal-data-space-details-dataverse-item-stat-card-updated">
              <p>{t('resources.lastUpdate')}</p>
              <p>{localisedLastUpdate}</p>
            </div>
          </div>
        </div>
        <p className="okp4-dataverse-portal-data-space-details-dataverse-item-stat-card-stat">
          {amount}
        </p>
      </>
    </Card>
  )
}
