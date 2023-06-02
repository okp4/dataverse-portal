import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import '../i18n/index'
import './explore.scss'
import type { DataverseItemCardProps } from '@/ui/view/dataverse/component/dataverseItemCard/dataverseItemCard'
import { DataverseItemCard } from '@/ui/view/dataverse/component/dataverseItemCard/dataverseItemCard'
import { Button } from '@/ui/component/button/button'
import { Icon } from '@/ui/component/icon/icon'
import { NavLink } from 'react-router-dom'
import { routes } from '@/ui/routes'

const exploreItems: DataverseItemCardProps[] = [
  {
    id: 'ef347285-e52a-430d-9679-dcb76b962ce7',
    type: 'dataspace',
    label: 'Rhizome',
    description:
      'Rhizome is a data space operated by OKP4, currently under development based on OKP4 technology. Rhizome demonstrates the power of data processing and sharing, and the value we can achieve by effectively connecting different sources of open access agricultural data in different data formats. Rhizome aims to connect as much data as possible and provide valuable visuals and metrics in various agriculture-related areas, such as land use and land management, crop and livestock management, and forest resources and timber industry.'
  },
  {
    id: '957df710-4e35-45fb-add8-34d49904a77a',
    type: 'dataset',
    label: 'Agreste 2020',
    description:
      'Annual agricultural statistics, consisting of the areas, yields and production of the French territory."'
  },
  {
    id: '79ec2986-0d71-4e92-a48d-95379b3da9ed',
    type: 'dataset',
    label: 'ADMIN EXPRESS COG 2020 DEPARTMENT',
    description:
      'ADMIN EXPRESS allows cross-referencing with other data sources in order to build thematic representations of the territory according to an administrative granularity (commune, departmental district, department, region). ADMIN EXPRESS is available in a "COG" edition, in accordance with the official geographic code published each year by INSEE.'
  },
  {
    id: '16c4cd10-521a-4829-b1bd-a1e2ac60459a',
    type: 'service',
    label: 'Data connector',
    description:
      'This service allows you to inject data files into OpenSearch so that you can consume the knowledge created through visualization.'
  }
]

export const Explore: FC = () => {
  const { t } = useTranslation('home')

  return (
    <>
      <h1>{t('home.blocks.explore.label')}</h1>
      {exploreItems.map(({ id, type, description, label }) => (
        <div className="okp4-dataverse-portal-home-page-explore-card-wrapper" key={label}>
          <DataverseItemCard description={description} id={id} label={label} type={type} />
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
