import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/ui/component/card/card'
import { useMemo } from 'react'
import { shallow } from 'zustand/shallow'
import { Icon } from '@/ui/component/icon/icon'
import { useStatsAggregate } from '@/domain/stats/aggregate'
import { useAppStore } from '@/ui/store/appStore'
import '../i18n/index'
import './community.scss'

type StatProps = {
  description: string
  stat: number
  icon?: JSX.Element
}

type SingleStat = StatProps & {
  _tag: 'singlestat'
  background?: JSX.Element
}

type MultiStat = {
  _tag: 'multistat'
  stats: StatProps[]
  background?: JSX.Element
}

type StatCard = SingleStat | MultiStat

const Stat: FC<StatProps> = ({ description, stat, icon }): JSX.Element => (
  <div className="okp4-dataverse-portal-home-page-stat-main">
    {icon && <div className="okp4-dataverse-portal-home-page-stat-icon-container">{icon}</div>}
    <div className="okp4-dataverse-portal-home-page-stat-content-wrapper">
      <h2>{stat}</h2>
      <p>{description}</p>
    </div>
  </div>
)

// eslint-disable-next-line max-lines-per-function
export const Community: FC = () => {
  const { t } = useTranslation('home')
  const theme = useAppStore(store => store.theme)
  const { dataspacesCreatedNb, datasetsSharedNb, servicesSharedNb, communityParticipantNb } =
    useStatsAggregate(
      aggregate => ({
        dataspacesCreatedNb: aggregate.dataspacesCreatedNb,
        datasetsSharedNb: aggregate.datasetsSharedNb,
        servicesSharedNb: aggregate.servicesSharedNb,
        communityParticipantNb: aggregate.communityParticipantNb
      }),
      shallow
    )

  const statCards: StatCard[] = useMemo(
    () => [
      {
        _tag: 'singlestat',
        stat: communityParticipantNb,
        description: t('home.blocks.community.stats.communityParticipants'),
        background: <div className="okp4-dataverse-portal-home-page-community-ellipse" />
      },
      {
        _tag: 'multistat',
        stats: [
          {
            icon: <Icon name={`dataspace-created-${theme}`} />,
            stat: dataspacesCreatedNb,
            description: t('home.blocks.community.stats.zonesCreated')
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
        ]
      }
    ],
    [communityParticipantNb, datasetsSharedNb, dataspacesCreatedNb, servicesSharedNb, t, theme]
  )

  return (
    <>
      <h1>{t('home.blocks.community.label')}</h1>
      {statCards.map(statCard => (
        <Card
          key={statCard._tag}
          mainClassName={`okp4-dataverse-portal-home-page-community-${statCard._tag}-card`}
        >
          <>
            <div className={`okp4-dataverse-portal-home-page-community-${statCard._tag}-container`}>
              {statCard._tag === 'multistat' ? (
                statCard.stats.map(({ description, stat, icon }, index) => (
                  <Stat description={description} icon={icon} key={index} stat={stat} />
                ))
              ) : (
                <Stat
                  description={statCard.description}
                  icon={statCard.icon}
                  key={statCard._tag}
                  stat={statCard.stat}
                />
              )}
            </div>
            {statCard.background}
          </>
        </Card>
      ))}
    </>
  )
}
