import { DataverseCard } from '@/component/card/dataverseCard/dataverseCard'
import type { DataverseCardProps } from '@/component/card/dataverseCard/dataverseCard'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBreakpoint } from '@/hook/useBreakpoint'
import { useAppStore } from '@/store/appStore'
import { Button } from '@/component/button/button'
import Chip from '@/component/chip/chip'
import { Icon } from '@/component/icon/icon'
import type { IconName } from '@/component/icon/icon'
import './dataverse.scss'

type DataverseItem = 'dataspace' | 'dataset' | 'service'
type FilterLabel = 'dataspaces' | 'datasets' | 'services' | 'all'
type FilterValue = DataverseItem | 'all'
type DataverseItemDetails = DataverseCardProps

type Filter = {
  label: FilterLabel
  value: FilterValue
  icon: string
}

const filters: Filter[] = [
  {
    label: 'all',
    value: 'all',
    icon: 'all'
  },
  {
    label: 'dataspaces',
    value: 'dataspace',
    icon: 'dataspace-created'
  },
  {
    label: 'datasets',
    value: 'dataset',
    icon: 'dataset-folder'
  },
  {
    label: 'services',
    value: 'service',
    icon: 'service-folder'
  }
]

const dataverseItems: DataverseItemDetails[] = [
  {
    type: 'dataspace',
    label: 'Rhizome',
    description:
      'Rhizome is a data space operated by OKP4, currently under development based on OKP4 technology. Rhizome demonstrates the power of data processing and sharing, and the value we can achieve by effectively connecting different sources of open access agricultural data in different data formats. Rhizome aims to connect as much data as possible and provide valuable visuals and metrics in various agriculture-related areas, such as land use and land management, crop and livestock management, and forest resources and timber industry.'
  },
  {
    type: 'dataset',
    label: 'ADMIN EXPRESS COG 2022 DEPARTMENT',
    description:
      'ADMIN EXPRESS allows cross-referencing with other data sources in order to build thematic representations of the territory according to an administrative granularity (commune, departmental district, department, region). ADMIN EXPRESS is available in a "COG" edition, in accordance with the official geographic code published each year by INSEE.'
  },
  {
    type: 'service',
    label: 'Data Connector',
    description:
      'This service allows you to inject data files into OpenSearch so that you can consume the knowledge created through visualization.'
  },
  {
    type: 'dataset',
    label:
      'Crop and crop group reference table of the Graphic Parcel Register (Registre Parcellaire Graphique)',
    description:
      'Table specific to the distribution of the Graphic Parcel Register (Registre Parcellaire Graphique)): The notion of crop group in this table does not correspond to the notion of crop group of the CAP regulation nor to that of the ISIS reference systems. In this table, each crop code is explained by a label and linked to a crop group code and its label.'
  },
  {
    type: 'dataset',
    label: 'ADMIN EXPRESS COG 2022 REGION',
    description:
      'ADMIN EXPRESS allows cross-referencing with other data sources in order to build thematic representations of the territory according to an administrative granularity (commune, departmental district, department, region). ADMIN EXPRESS is available in a "COG" edition, in accordance with the official geographic code published each year by INSEE.'
  },
  {
    type: 'service',
    label: 'Data Refactor',
    description:
      'The Data Refactor tool allows you to edit and modify a data set in order to standardize it.'
  },
  {
    type: 'dataset',
    label: 'FRANCE : REGION - DEPARTMENT - CITY',
    description:
      'This dataset is obtained by joining 3 ADMIN EXPRESS datasets containing the different layers of the French territory: Region, Department and City.'
  },
  {
    type: 'dataset',
    label: 'ADMIN EXPRESS COG 2020 DEPARTMENT',
    description:
      'ADMIN EXPRESS allows cross-referencing with other data sources in order to build thematic representations of the territory according to an administrative granularity (commune, departmental district, department, region). ADMIN EXPRESS is available in a "COG" edition, in accordance with the official geographic code published each year by INSEE.'
  },
  {
    type: 'service',
    label: 'Data Join Tabular',
    description:
      'The Data Join Tabular tool allows you to join two datasets containing common values to provide new information.'
  },
  {
    type: 'dataset',
    label: 'ADMIN EXPRESS COG 2022 CITY',
    description:
      'ADMIN EXPRESS allows cross-referencing with other data sources in order to build thematic representations of the territory according to an administrative granularity (commune, departmental district, department, region). ADMIN EXPRESS is available in a "COG" edition, in accordance with the official geographic code published each year by INSEE.'
  },
  {
    type: 'dataset',
    label: 'RPG FRANCE 2020',
    description:
      'The graphical parcel register is a geographic database used as a reference for the instruction of Common Agricultural Policy (CAP) subsidies. The anonymized version distributed here as part of the public service for making reference data available contains the graphic data of parcels (since 2015) with their main crop. These data are produced by the Agency of Services and Payment (ASP) since 2007'
  },
  {
    type: 'service',
    label: 'Data Grouping',
    description: 'The Data Grouping tool allows you to organize identical data into groups.'
  },
  {
    type: 'dataset',
    label: 'AGRESTE 2020',
    description:
      'Annual agricultural statistics, consisting of the areas, yields and production of the French territory.'
  },
  {
    type: 'dataset',
    label: 'RPG AGRESTE 2020',
    description:
      'Data set resulting from the join between RPG and AGRESTE data. Obtained through a sequence of data processing using the OKP4 protocol.'
  },
  {
    type: 'service',
    label: 'Storage',
    description: 'Data storage service'
  },
  {
    type: 'dataset',
    label: 'ADMIN EXPRESS COG 2020 REGION',
    description:
      'ADMIN EXPRESS allows cross-referencing with other data sources in order to build thematic representations of the territory according to an administrative granularity (commune, departmental district, department, region). ADMIN EXPRESS is available in a "COG" edition, in accordance with the official geographic code published each year by INSEE.'
  },
  {
    type: 'dataset',
    label: 'Reference table of NAF Rev2 codes',
    description:
      'The French Nomenclature of Activities (NAF) is a nomenclature of productive economic activities, mainly developed to facilitate the organization of economic and social information.'
  },
  {
    type: 'service',
    label: 'Data Join Geospatial',
    description: 'The Data Join Geospatial tool allows to join two georeferenced datasets.'
  },
  {
    type: 'dataset',
    label: 'BASE SIRENE - NAF',
    description:
      'This dataset is obtained using the join between the SIRENE database and the NAF code reference table to obtain information on the activity of establishments.'
  },
  {
    type: 'dataset',
    label: 'SIRENE database - agriculture, forestry and fishing',
    description:
      'This dataset refers to all the agricultural, forestry and fishing companies in France in activity. Obtained through a sequence of data processing using the OKP4 protocol.'
  }
]

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

const filtersInitialState: FilterValue[] = ['all']

// eslint-disable-next-line max-lines-per-function
const Dataverse = (): JSX.Element => {
  const { t } = useTranslation('common')
  const theme = useAppStore(state => state.theme)
  const { isDesktop, isLargeDesktop } = useBreakpoint()
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)
  const [selectedFilters, setSelectedFilters] = useState<FilterValue[]>(filtersInitialState)
  const [dataverseResources, setDataverseResources] =
    useState<DataverseItemDetails[]>(dataverseItems)

  const isLargeScreen = isDesktop || isLargeDesktop
  const filtersLabel = t('filters')

  const resetFilters = useCallback((): void => {
    setSelectedFilters(filtersInitialState)
  }, [])

  const removeFilter = useCallback(
    (filterToRemove: FilterValue): void => {
      if (selectedFilters.length === 1 && selectedFilters[0] === 'all') {
        return
      }
      setSelectedFilters(selectedFilters.filter(filter => filter !== filterToRemove))
    },
    [selectedFilters]
  )

  const addFilterAndRemoveAllFilter = useCallback(
    (filterToAdd: FilterValue): void => {
      const updatedFiltersWithoutAll = [...selectedFilters, filterToAdd].filter(
        filter => filter !== 'all'
      )
      setSelectedFilters(updatedFiltersWithoutAll)
    },
    [selectedFilters]
  )

  const addFilter = useCallback(
    (filterToAdd: FilterValue): void => {
      filterToAdd === 'all' ? resetFilters() : addFilterAndRemoveAllFilter(filterToAdd)
    },
    [resetFilters, addFilterAndRemoveAllFilter]
  )

  const toggleFilter = useCallback(
    (filter: FilterValue) => () => {
      selectedFilters.includes(filter) ? removeFilter(filter) : addFilter(filter)
    },
    [addFilter, removeFilter, selectedFilters]
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
            {filters.map(filter => (
              <Chip
                className={`okp4-dataverse-portal-dataverse-page-filter ${filter.label}`}
                icon={<Icon name={`${filter.icon}-${theme}` as IconName} />}
                isSelected={selectedFilters.includes(filter.value)}
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
    if (selectedFilters === filtersInitialState) {
      setDataverseResources(dataverseItems)
    } else {
      const filteredResources = dataverseItems.filter(resource =>
        selectedFilters.includes(resource.type)
      )
      setDataverseResources(filteredResources)
    }
  }, [selectedFilters])

  useEffect(() => {
    !selectedFilters.length && resetFilters()
  }, [resetFilters, selectedFilters.length])

  useEffect(() => {
    !isLargeScreen && setShowMobileFilters(false)
  }, [isLargeScreen])

  return (
    <div className="okp4-dataverse-portal-dataverse-page-main">
      {(isLargeScreen || showMobileFilters) && (
        <div className="okp4-dataverse-portal-dataverse-page-filters-container">
          <FiltersChips />
        </div>
      )}
      <div className="okp4-dataverse-portal-dataverse-page-catalog">
        <h1>{t('actions.explore')}</h1>
        {(isLargeScreen || !showMobileFilters) && (
          <Button
            className="okp4-dataverse-portal-dataverse-page-filters-button"
            label={t('filters')}
            onClick={toggleMobileFilters}
            variant="primary"
          />
        )}
        <div className="okp4-dataverse-portal-dataverse-page-cards-container">
          {dataverseResources.map(({ type, label, description }) => (
            <DataverseCard description={description} key={label} label={label} type={type} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dataverse
