import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'
import { Card } from '@/component/card/card'
import { Icon } from '@/component/icon/icon'
import { useStatsAggregate } from '@/domain/stats/aggregate'
import { useAppStore } from '@/store/appStore'
import './home.scss'
import './i18n/index'

const Stats: FC = () => {
  const { t } = useTranslation('home')
  const theme = useAppStore(store => store.theme)
  const { dataspacesCreatedNb, datasetsSharedNb, servicesSharedNb } = useStatsAggregate(
    aggregate => ({
      dataspacesCreatedNb: aggregate.dataspacesCreatedNb,
      datasetsSharedNb: aggregate.datasetsSharedNb,
      servicesSharedNb: aggregate.servicesSharedNb
    }),
    shallow
  )
  return (
    <Card>
      <div className="okp4-dataverse-portal-home-page-stats-container">
        <div className="okp4-dataverse-portal-home-page-stats-content-wrapper">
          <div className="okp4-dataverse-portal-home-page-stats-content-icon-container">
            <Icon name={`dataspace-created-${theme}`} />
          </div>
          <div>
            <h2>{dataspacesCreatedNb}</h2>
            <p>{t('home.blocks.community.stats.dataspacesCreated')}</p>
          </div>
        </div>
        <div className="okp4-dataverse-portal-home-page-stats-content-wrapper">
          <div className="okp4-dataverse-portal-home-page-stats-content-icon-container">
            <Icon name={`dataset-folder-${theme}`} />
          </div>
          <div>
            <h2>{datasetsSharedNb}</h2>
            <p>{t('home.blocks.community.stats.datasetsShared')}</p>
          </div>
        </div>
        <div className="okp4-dataverse-portal-home-page-stats-content-wrapper">
          <div className="okp4-dataverse-portal-home-page-stats-content-icon-container">
            <Icon name={`service-folder-${theme}`} />
          </div>
          <div>
            <h2>{servicesSharedNb}</h2>
            <p>{t('home.blocks.community.stats.servicesShared')}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export const Home: FC = () => {
  const { t } = useTranslation('home')
  return (
    <div className="okp4-dataverse-portal-home-page-main">
      <div className="okp4-dataverse-portal-home-page-block-container">
        <h1>{t('home.blocks.community.label')}</h1>
        <Stats />
      </div>
    </div>
  )
}
