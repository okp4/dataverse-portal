import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'
import { Card } from '@/component/card/card'
import { Icon } from '@/component/icon/icon'
import { useStatsAggregate } from '@/domain/stats/aggregate'
import { useAppStore } from '@/store/appStore'
import './home.scss'
import './i18n/index'

type Stats = {
  icon?: JSX.Element
  stat: number
  description: string
}

const Stats: FC = () => {
  const { t } = useTranslation('home')
  const theme = useAppStore(store => store.theme)
  const { dataspacesCreatedNb, datasetsSharedNb, servicesSharedNb } =
    useStatsAggregate(
      aggregate => ({
        dataspacesCreatedNb: aggregate.dataspacesCreatedNb,
        datasetsSharedNb: aggregate.datasetsSharedNb,
        servicesSharedNb: aggregate.servicesSharedNb
      }),
      shallow
    )

  const stats: Stats[] = useMemo(
    () => [
      
      {
        icon: <Icon name={`dataspace-created-${theme}`} />,
        stat: dataspacesCreatedNb,
        description: t('home.blocks.community.stats.dataspacesCreated')
      },
      {
        icon: <Icon name={`dataset-folder-${theme}`} />,
        stat: datasetsSharedNb,
        description: t('home.blocks.community.stats.datasetsShared')
      },
      {
        icon: <Icon name={`service-folder-${theme}`} />,
        stat: servicesSharedNb,
        description: t('home.blocks.community.stats.servicesShared')
      }
    ],
    [ datasetsSharedNb, dataspacesCreatedNb, servicesSharedNb, t, theme]
  )

  return (
   
      <Card>
        <div className="okp4-dataverse-portal-home-page-stats-container">
          {stats.slice(1, 4).map(({ icon, stat, description }, index) => (
            <div className="okp4-dataverse-portal-home-page-stats-content-wrapper" key={index}>
              {icon && (
                <div className="okp4-dataverse-portal-home-page-stats-content-icon-container">
                  {icon}
                </div>
              )}
              <div>
                <h2>{stat}</h2>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
  )
}

export const Home: FC = () => {
  const { t } = useTranslation('home')

  return (
    <div className="okp4-dataverse-portal-home-page-main">
      <div className="okp4-dataverse-portal-home-page-block-container-community">
        <h1>{t('home.blocks.community.label')}</h1>
        <Stats />
      </div>
    </div>
  )
}
