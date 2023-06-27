import { useCallback } from 'react'
import type { FC } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../i18n/index'
import './explore.scss'
import { DataverseItemCard } from '@/ui/view/dataverse/component/dataverseItemCard/dataverseItemCard'
import { Button } from '@/ui/component/button/button'
import { Icon } from '@/ui/component/icon/icon'
import { routes } from '@/ui/routes'
import type { DataverseItem } from '@/ui/types'

type DataverseItemCardProps = {
  id: string
  type: DataverseItem
  label: string
  topic: string
}

const exploreItems: DataverseItemCardProps[] = [
  {
    id: 'ef347285-e52a-430d-9679-dcb76b962ce7',
    type: 'zone',
    label: 'Rhizome',
    topic: 'Agriculture, food, environment and forestry'
  },
  {
    id: '957df710-4e35-45fb-add8-34d49904a77a',
    type: 'dataset',
    label: 'Agreste 2020',
    topic: 'Agriculture, food, environment and forestry'
  },
  {
    id: '79ec2986-0d71-4e92-a48d-95379b3da9ed',
    type: 'dataset',
    label: 'ADMIN EXPRESS COG 2020 DEPARTMENT',
    topic: 'Other'
  },
  {
    id: '16c4cd10-521a-4829-b1bd-a1e2ac60459a',
    type: 'service',
    label: 'Data connector',
    topic: 'Data Integration'
  }
]

export const Explore: FC = () => {
  const { t } = useTranslation('home')
  const navigate = useNavigate()

  const handleDataverseItemDetails = useCallback(
    (id: string, type: DataverseItem) => (): void => {
      navigate(`/dataverse/${type}/${id}`)
    },
    [navigate]
  )

  return (
    <>
      <h1>{t('home.blocks.explore.label')}</h1>
      {exploreItems.map(({ id, type, topic, label }) => (
        <div className="okp4-dataverse-portal-home-page-explore-card-wrapper" key={label}>
          <DataverseItemCard
            button={
              <Button label={t('actions.details')} onClick={handleDataverseItemDetails(id, type)} />
            }
            label={label}
            topic={topic}
            type={type}
          />
        </div>
      ))}
      <NavLink
        className="okp4-dataverse-portal-home-page-explore-catalog-button"
        to={routes.dataverse}
      >
        <Button
          icons={{ endIcon: <Icon name="arrow-right" /> }}
          label={t('home.blocks.explore.catalog')}
          size="large"
          variant="primary"
        />
      </NavLink>
    </>
  )
}
