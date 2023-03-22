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

export const Explore: FC = () => {
  const { t } = useTranslation('home')
  const exploreItems: DataverseCardProps[] = [
    {
      type: 'dataspace',
      label: 'Rhizome',
      description: 'Agriculture, Food, Environment and Forestry'
    },
    {
      type: 'dataset',
      label: 'Agreste 2020',
      description: 'Agriculture, Food, Environment and Forestry'
    },
    {
      type: 'dataset',
      label: 'Graphical Plot Registry France 2020',
      description: 'Agriculture, Food, Environment and Forestry'
    },
    {
      type: 'service',
      label: 'Data connector',
      description: 'Data Integration'
    }
  ]
  return (
    <>
      <h1>{t('home.blocks.explore.label')}</h1>
      {exploreItems.map(({ type, description, label }) => (
        <div className="okp4-dataverse-portal-home-page-explore-card-wrapper" key={label}>
          <DataverseCard description={description} label={label} type={type} />
        </div>
      ))}
      <NavLink
        className="okp4-dataverse-portal-home-page-explore-catalog-button"
        to={routes.dataverse}
      >
        <Button
          icons={{ endIcon: <Icon name="arrow-right" /> }}
          label={t('home.blocks.explore.catalog')}
          variant="catalog"
        />
      </NavLink>
    </>
  )
}
