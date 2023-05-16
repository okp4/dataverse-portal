import * as A from 'fp-ts/Array'
import type { Option } from 'fp-ts/Option'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import { pipe } from 'fp-ts/lib/function'
import { useBreakpoint } from '@/ui/hook/useBreakpoint'
import { useAppStore } from '@/ui/store/appStore'
import { useDataverseStore } from '@/ui/store/index'
import { DataverseItemCard } from '@/ui/view/dataverse/component/dataverseItemCard/dataverseItemCard'
import { Button } from '@/ui/component/button/button'
import Chip from '@/ui/component/chip/chip'
import { Icon } from '@/ui/component/icon/icon'
import type { IconName } from '@/ui/component/icon/icon'
import './dataverse.scss'
import { toEffectfulObject } from '@/util/effect'
import { activeLanguageWithDefault } from '@/ui/languages/languages'
import { Card } from '@/ui/component/card/card'
import { Skeleton } from '@/ui/component/skeleton/skeleton'
import { LottieLoader } from '@/ui/component/loader/lottieLoader'
import threeDots from '@/ui/asset/loader/threeDots.json'
import { shallow } from 'zustand/shallow'

type DataverseItemType = 'DataSpace' | 'Dataset' | 'Service'
type FilterLabel = 'dataspaces' | 'datasets' | 'services' | 'all'
type FilterValue = DataverseItemType | 'all'

type DataverseItem = {
  id: string
  label: string
  description: string
}

export type InternationalizedDescription = {
  [lang in 'en' | 'fr' | 'de']: string
}

export type Governance = {
  description: InternationalizedDescription
}

type Typed<T extends DataverseItemType> = { type: T }

type DataSpaceResource = {
  type: Exclude<DataverseItemType, 'dataspace'>
  amount: number
  lastUpdated: string
}

export type Service = DataverseItem & Typed<'service'>

export type Dataset = DataverseItem & Typed<'dataset'>

export type DataSpace = DataverseItem &
  Typed<'dataspace'> & {
    governance: Governance
    resources: DataSpaceResource[]
  }

export type DataverseItemDetails = DataSpace | Dataset | Service

type Filter = {
  label: FilterLabel
  value: FilterValue
  icon: string
}

const uifilters: Filter[] = [
  {
    label: 'all',
    value: 'all',
    icon: 'all'
  },
  {
    label: 'dataspaces',
    value: 'DataSpace',
    icon: 'dataspace-created'
  },
  {
    label: 'datasets',
    value: 'Dataset',
    icon: 'dataset-folder'
  },
  {
    label: 'services',
    value: 'Service',
    icon: 'service-folder'
  }
]

const dataverseItems: DataverseItemDetails[] = [
  {
    id: '1',
    type: 'dataspace',
    label: 'Rhizome',
    description:
      'Rhizome is a data space operated by OKP4, currently under development based on OKP4 technology. Rhizome demonstrates the power of data processing and sharing, and the value we can achieve by effectively connecting different sources of open access agricultural data in different data formats. Rhizome aims to connect as much data as possible and provide valuable visuals and metrics in various agriculture-related areas, such as land use and land management, crop and livestock management, and forest resources and timber industry.',
    governance: {
      description: {
        en: 'This first Data Space has a centralized governance: only OKP4 can modify the rules. In this first version, only OKP4 can register data and services. However, any wallet is allowed to download data.',
        fr: "Ce premier Data Space a une gouvernance centralisée : seul OKP4 peut modifier les règles. Dans cette première version, seul OKP4 peut enregistrer des données et des services. Toutefois, n'importe quel wallet est autorisé à télécharger les données.",
        de: 'Dieser erste Data Space hat eine zentralisierte Governance: Nur OKP4 kann die Regeln ändern. In dieser ersten Version kann nur OKP4 Daten und Dienste speichern. Allerdings ist es jeder Wallet erlaubt, Daten hochzuladen.'
      }
    },
    resources: [
      {
        type: 'dataset',
        amount: 20,
        lastUpdated: '2023-03-28T00:00:00+00:00'
      },
      {
        type: 'service',
        amount: 7,
        lastUpdated: '2023-03-31T00:00:00+00:00'
      }
    ]
  },
  {
    id: '2',
    type: 'dataset',
    label: 'ADMIN EXPRESS COG 2022 DEPARTMENT',
    description:
      'ADMIN EXPRESS allows cross-referencing with other data sources in order to build thematic representations of the territory according to an administrative granularity (commune, departmental district, department, region). ADMIN EXPRESS is available in a "COG" edition, in accordance with the official geographic code published each year by INSEE.'
  },
  {
    id: '3',
    type: 'service',
    label: 'Data Connector',
    description:
      'This service allows you to inject data files into OpenSearch so that you can consume the knowledge created through visualization.'
  },
  {
    type: 'dataset',
    id: '4',
    label:
      'Crop and crop group reference table of the Graphic Parcel Register (Registre Parcellaire Graphique)',
    description:
      'Table specific to the distribution of the Graphic Parcel Register (Registre Parcellaire Graphique)): The notion of crop group in this table does not correspond to the notion of crop group of the CAP regulation nor to that of the ISIS reference systems. In this table, each crop code is explained by a label and linked to a crop group code and its label.'
  },
  {
    id: '5',
    type: 'dataset',
    label: 'ADMIN EXPRESS COG 2022 REGION',
    description:
      'ADMIN EXPRESS allows cross-referencing with other data sources in order to build thematic representations of the territory according to an administrative granularity (commune, departmental district, department, region). ADMIN EXPRESS is available in a "COG" edition, in accordance with the official geographic code published each year by INSEE.'
  },
  {
    id: '6',
    type: 'service',
    label: 'Data Refactor',
    description:
      'The Data Refactor tool allows you to edit and modify a data set in order to standardize it.'
  },
  {
    id: '7',
    type: 'dataset',
    label: 'FRANCE : REGION - DEPARTMENT - CITY',
    description:
      'This dataset is obtained by joining 3 ADMIN EXPRESS datasets containing the different layers of the French territory: Region, Department and City.'
  },
  {
    id: '8',
    type: 'dataset',
    label: 'ADMIN EXPRESS COG 2020 DEPARTMENT',
    description:
      'ADMIN EXPRESS allows cross-referencing with other data sources in order to build thematic representations of the territory according to an administrative granularity (commune, departmental district, department, region). ADMIN EXPRESS is available in a "COG" edition, in accordance with the official geographic code published each year by INSEE.'
  },
  {
    id: '9',
    type: 'service',
    label: 'Data Join Tabular',
    description:
      'The Data Join Tabular tool allows you to join two datasets containing common values to provide new information.'
  },
  {
    id: '10',
    type: 'dataset',
    label: 'ADMIN EXPRESS COG 2022 CITY',
    description:
      'ADMIN EXPRESS allows cross-referencing with other data sources in order to build thematic representations of the territory according to an administrative granularity (commune, departmental district, department, region). ADMIN EXPRESS is available in a "COG" edition, in accordance with the official geographic code published each year by INSEE.'
  },
  {
    id: '11',
    type: 'dataset',
    label: 'RPG FRANCE 2020',
    description:
      'The graphical parcel register is a geographic database used as a reference for the instruction of Common Agricultural Policy (CAP) subsidies. The anonymized version distributed here as part of the public service for making reference data available contains the graphic data of parcels (since 2015) with their main crop. These data are produced by the Agency of Services and Payment (ASP) since 2007'
  },
  {
    id: '12',
    type: 'service',
    label: 'Data Grouping',
    description: 'The Data Grouping tool allows you to organize identical data into groups.'
  },
  {
    id: '13',
    type: 'dataset',
    label: 'AGRESTE 2020',
    description:
      'Annual agricultural statistics, consisting of the areas, yields and production of the French territory.'
  },
  {
    id: '14',
    type: 'dataset',
    label: 'RPG AGRESTE 2020',
    description:
      'Data set resulting from the join between RPG and AGRESTE data. Obtained through a sequence of data processing using the OKP4 protocol.'
  },
  { id: '15', type: 'service', label: 'Storage', description: 'Data storage service' },
  {
    id: '16',
    type: 'dataset',
    label: 'ADMIN EXPRESS COG 2020 REGION',
    description:
      'ADMIN EXPRESS allows cross-referencing with other data sources in order to build thematic representations of the territory according to an administrative granularity (commune, departmental district, department, region). ADMIN EXPRESS is available in a "COG" edition, in accordance with the official geographic code published each year by INSEE.'
  },
  {
    id: '17',
    type: 'dataset',
    label: 'Reference table of NAF Rev2 codes',
    description:
      'The French Nomenclature of Activities (NAF) is a nomenclature of productive economic activities, mainly developed to facilitate the organization of economic and social information.'
  },
  {
    id: '18',
    type: 'service',
    label: 'Data Join Geospatial',
    description: 'The Data Join Geospatial tool allows to join two georeferenced datasets.'
  },
  {
    id: '19',
    type: 'dataset',
    label: 'BASE SIRENE - NAF',
    description:
      'This dataset is obtained using the join between the SIRENE database and the NAF code reference table to obtain information on the activity of establishments.'
  },
  {
    id: '20',
    type: 'dataset',
    label: 'SIRENE database - agriculture, forestry and fishing',
    description:
      'This dataset refers to all the agricultural, forestry and fishing companies in France in activity. Obtained through a sequence of data processing using the OKP4 protocol.'
  },
  {
    id: '21',
    type: 'dataspace',
    label: 'DS4I',
    description:
      "Data Space for Investors (DS4I) is a private Data Space created and maintained by OKP4 Team. DS4I's purpose is to present a simple and user-friendly Proof of Concept to demonstrate for potential investors how OKP4 protocol works based on simple governance rules.",
    governance: {
      description: {
        en: 'DS4I is a private Data Space where resources are only accessible for a group of addresses contained in a dedicated whitelist. Only OKP4 have the authority to edit the Whitelist.',
        fr: "DS4I est un Data Space privé où les ressources ne sont accessibles que pour un groupe d'adresses de wallets contenues dans une Whitelist dédiée. Seul OKP4 a le droit de modifier cette whitelist.",
        de: 'DS4I ist ein privater Data Space, in dem die Ressourcen nur für eine Gruppe zugänglich sind. Adressen von Wallets, die in einer dedizierten Whitelist enthalten sind. Nur OKP4 hat das Recht, diese Whitelist zu ändern.'
      }
    },
    resources: [
      {
        type: 'dataset',
        amount: 1,
        lastUpdated: '2023-03-25T00:00:00+00:00'
      },
      {
        type: 'service',
        amount: 1,
        lastUpdated: '2023-04-02T00:00:00+00:00'
      }
    ]
  }
]

export const getResourceDetails = (id: string): Option<DataverseItemDetails> =>
  pipe(
    dataverseItems,
    A.findFirst(item => item.id === id)
  )

const renderMobileTitleFilters = (label: string, toggleMobileFilters: () => void): JSX.Element => (
  <div className="okp4-dataverse-portal-dataverse-page-filters-mobile">
    <div
      className="okp4-dataverse-portal-dataverse-page-filters-previous-icon"
      onClick={toggleMobileFilters}
    >
      <Icon name="arrow-left" />
    </div>
    <h1>{label}</h1>
  </div>
)

// const filtersInitialState: FilterValue[] = ['all']

// eslint-disable-next-line max-lines-per-function
const Dataverse = (): JSX.Element => {
  const { t } = useTranslation('common')
  const theme = useAppStore(state => state.theme)
  const { loadDataverse, dataverse, setByTypeFilter, isLoading, hasNext, filters, setLanguage } =
    toEffectfulObject(
      useDataverseStore(
        state => ({
          loadDataverse: state.loadDataverse,
          dataverse: state.dataverse,
          isLoading: state.query.isLoading,
          hasNext: state.query.hasNext,
          setLanguage: state.query.setLanguage,
          setByTypeFilter: state.query.setByTypeFilter,
          filters: state.query.filters
        }),
        shallow
      )
    )
  const { isDesktop, isLargeDesktop } = useBreakpoint()
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)
  const currentLng = activeLanguageWithDefault().lng

  const isLargeScreen = isDesktop || isLargeDesktop
  const filtersLabel = t('filters')

  const toggleFilter = useCallback(
    (filter: DataverseItemType | 'all') => () => {
      setByTypeFilter(filter)
      loadDataverse()
    },
    [loadDataverse, setByTypeFilter]
  )

  const toggleMobileFilters = useCallback(() => {
    setShowMobileFilters(!showMobileFilters)
  }, [showMobileFilters])

  const FiltersChips = (): JSX.Element =>
    useMemo(
      () => (
        <div className="okp4-dataverse-portal-dataverse-page-filters">
          {!isLargeScreen ? (
            renderMobileTitleFilters(filtersLabel, toggleMobileFilters)
          ) : (
            <h1>{filtersLabel}</h1>
          )}
          <h2>{t('resources.label')}</h2>
          <div className="okp4-dataverse-portal-dataverse-page-filters-chips">
            {uifilters.map(filter => (
              <Chip
                className={`okp4-dataverse-portal-dataverse-page-filter ${filter.label}`}
                icon={<Icon name={`${filter.icon}-${theme}` as IconName} />}
                isSelected={
                  filters.byType === filter.value ||
                  filters.byType.includes(filter.value as DataverseItemType)
                }
                key={filter.label}
                label={t(`resources.${filter.label}`)}
                onClick={toggleFilter(filter.value)}
              />
            ))}
          </div>
        </div>
      ),
      []
    )

  useEffect(() => {
    setLanguage(currentLng)
    loadDataverse()
  }, [currentLng])

  useEffect(() => {
    !isLargeScreen && setShowMobileFilters(false)
  }, [isLargeScreen])

  const loadingDataverseCards = [...Array(12)].map((_, i) => (
    <Card key={i}>
      <div className="okp4-dataverse-portal-dataverse-page-card-loader-container">
        <Skeleton height={30} variant="text" width={80} />
        <div className="okp4-dataverse-portal-dataverse-page-card-loader-text-wrapper">
          <Skeleton height={25} variant="text" width={'84%'} />
          <Skeleton height={25} variant="text" width={'84%'} />
        </div>
        <Skeleton height={40} variant="rounded" width={150} />
      </div>
    </Card>
  ))

  return (
    <InfiniteScroll
      dataLength={dataverse.length}
      hasMore={hasNext}
      loader={!showMobileFilters ? <LottieLoader animationData={threeDots} /> : null}
      next={loadDataverse}
      scrollThreshold={0.91}
      scrollableTarget="page-wrapper"
    >
      <div className="okp4-dataverse-portal-dataverse-page-main">
        {(isLargeScreen || showMobileFilters) && (
          <div className="okp4-dataverse-portal-dataverse-page-filters-container">
            <FiltersChips />
          </div>
        )}
        {(isLargeScreen || !showMobileFilters) && (
          <div className="okp4-dataverse-portal-dataverse-page-catalog">
            <h1>{t('actions.explore')}</h1>
            {!isLargeScreen && (
              <Button
                className="okp4-dataverse-portal-dataverse-page-filters-button"
                label={t('filters')}
                onClick={toggleMobileFilters}
                size="large"
                variant="primary"
              />
            )}
            <div className="okp4-dataverse-portal-dataverse-page-cards-container">
              {!dataverse.length && isLoading
                ? loadingDataverseCards
                : dataverse.map(({ id, properties }) => (
                    <DataverseItemCard
                      description={properties.find(p => p.property === 'description')?.value ?? ''}
                      id={id}
                      key={id}
                      label={properties.find(p => p.property === 'title')?.value ?? ''}
                      type={
                        properties
                          .find(p => p.property === 'type')
                          ?.value.toLowerCase() as DataverseItemType
                      }
                    />
                  ))}
            </div>
          </div>
        )}
      </div>
    </InfiniteScroll>
  )
}

export default Dataverse
