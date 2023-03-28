import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import '../i18n/index'
import './explore.scss'
import type { DataverseCardProps } from '@/component/card/dataverseCard/dataverseCard'
import { DataverseCard } from '@/component/card/dataverseCard/dataverseCard'
import { Button } from '@/component/button/button'
import { Icon } from '@/component/icon/icon'
import { NavLink } from 'react-router-dom'
import { routes } from '@/routes'

const exploreItems: DataverseCardProps[] = [
  {
    id: '1',
    type: 'dataspace',
    label: 'Rhizome',
    description: 'Agriculture, Food, Environment and Forestry'
  },
  {
    id: '13',
    type: 'dataset',
    label: 'Agreste 2020',
    description: 'Agriculture, Food, Environment and Forestry'
  },
  {
    id: '11',
    type: 'dataset',
    label: 'Graphical Plot Registry France 2020',
    description: 'Agriculture, Food, Environment and Forestry'
  },
  {
    id: '3',
    type: 'service',
    label: 'Data connector',
    description: 'Data Integration'
  }
]

export const Explore: FC = () => {
  const { t } = useTranslation('home')

  return (
    <>
      <h1>{t('home.blocks.explore.label')}</h1>
      {exploreItems.map(({ id, type, description, label }) => (
        <div className="okp4-dataverse-portal-home-page-explore-card-wrapper" key={label}>
          <DataverseCard description={description} id={id} label={label} type={type} />
        </div>
      ))}
      <NavLink
        className="okp4-dataverse-portal-home-page-explore-catalog-button"
        to={routes.dataverse}
      >
        <Button
          icons={{ endIcon: <Icon name="arrow-right" /> }}
          label={t('home.blocks.explore.catalog')}
          variant="primary"
        />
      </NavLink>
    </>
  )
}
