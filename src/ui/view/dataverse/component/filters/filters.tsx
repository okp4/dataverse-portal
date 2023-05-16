import type { FC } from 'react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Chip from '@/ui/component/chip/chip'
import type { IconName } from '@/ui/component/icon/icon'
import { Icon } from '@/ui/component/icon/icon'
import { useAppStore } from '@/ui/store/appStore'
import { useBreakpoint } from '@/ui/hook/useBreakpoint'
import type { DataverseItemType } from '@/ui/page/dataverse/dataverse'
import { DynamicCheckboxFilter } from './dynamicCheckboxFilter/dynamicCheckboxFilter'
import './filters.scss'

type MobileTitleFiltersProps = {
  label: string
  toggleMobileFilters: () => void
}
const MobileTitleFilters: FC<MobileTitleFiltersProps> = ({ label, toggleMobileFilters }) => (
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

type FilterTextProps = {
  text: string
}
const FilterText: FC<FilterTextProps> = ({ text }) => (
  <span className="okp4-dataverse-portal-dataverse-filter-text">{text}</span>
)

export type Filter = {
  label: FilterLabel
  value: FilterValue
  icon: string
}

export type FilterLabel = 'dataspaces' | 'datasets' | 'services' | 'all'
export type FilterValue = DataverseItemType | 'all'

type FiltersChipsProps = {
  toggleMobileFilters: () => void
  filters: Filter[]
  selectedFilters: FilterValue[]
  toggleFilter: (filter: FilterValue) => void
}
const FiltersChips = ({
  toggleMobileFilters,
  filters,
  selectedFilters,
  toggleFilter
}: FiltersChipsProps): JSX.Element => {
  const theme = useAppStore(state => state.theme)
  const { isDesktop, isLargeDesktop } = useBreakpoint()
  const isLargeScreen = isDesktop || isLargeDesktop
  const { t } = useTranslation(['common', 'filters'])

  const handleFilterClick = useCallback(
    (filter: Filter) => () => {
      toggleFilter(filter.value)
    },
    [toggleFilter]
  )

  return (
    <div className="okp4-dataverse-portal-dataverse-page-filters">
      {!isLargeScreen ? (
        <MobileTitleFilters
          label={t('filters:filters')}
          toggleMobileFilters={toggleMobileFilters}
        />
      ) : (
        <h1>{t('filters:filters')}</h1>
      )}
      <FilterText text={t('resources.label')} />
      <div className="okp4-dataverse-portal-dataverse-page-filters-chips">
        {filters.map(filter => (
          <Chip
            className={`okp4-dataverse-portal-dataverse-page-filter ${filter.label}`}
            icon={<Icon name={`${filter.icon}-${theme}` as IconName} />}
            isSelected={selectedFilters.includes(filter.value)}
            key={filter.label}
            label={t(`resources.${filter.label}`)}
            onClick={handleFilterClick(filter)}
          />
        ))}
      </div>
    </div>
  )
}

type FiltersProps = {
  filters: Filter[]
  selectedFilters: FilterValue[]
  toggleFilter: (filter: FilterValue) => void
  toggleMobileFilters: () => void
}

// eslint-disable-next-line max-lines-per-function
export const Filters: FC<FiltersProps> = ({
  filters,
  selectedFilters,
  toggleFilter,
  toggleMobileFilters
}) => {
  const { t } = useTranslation('filters')

  return (
    <div className="okp4-dataverse-portal-dataverse-page-filters-container">
      <FiltersChips
        filters={filters}
        selectedFilters={selectedFilters}
        toggleFilter={toggleFilter}
        toggleMobileFilters={toggleMobileFilters}
      />
      <DynamicCheckboxFilter
        filterOptions={['Rhizome', 'DS4I', 'Data space 3', 'Data space 4']}
        name={<FilterText text={t('data-spaces.name')} />}
        searchPlaceholder={t('data-spaces.search')}
      />
      <DynamicCheckboxFilter
        filterOptions={['Agriculture environment and forestry', 'Marketing and customer behaviour']}
        name={<FilterText text={t('topics.name')} />}
        searchPlaceholder={t('topics.search')}
      />
      <DynamicCheckboxFilter
        filterOptions={[
          'Data cleaning',
          'Computer vision',
          'Machine learning',
          'Data mining',
          'Data visualization',
          'Data analysis',
          'Data management'
        ]}
        name={<FilterText text={t('services.name')} />}
        searchPlaceholder={t('services.search')}
      />
      <DynamicCheckboxFilter
        filterOptions={[
          'Afghanistan',
          'Albania',
          'Algeria',
          'American Samoa',
          'Andorra',
          'Angola',
          'Anguilla',
          'Antarctica',
          'Antigua and Barbuda',
          'Argentina',
          'Armenia',
          'Aruba',
          'Australia',
          'Austria',
          'Azerbaijan',
          'Bahamas (the)',
          'Bahrain',
          'Bangladesh',
          'Barbados',
          'Belarus',
          'Belgium'
        ]}
        name={<FilterText text={t('data-geo-cov.name')} />}
        searchPlaceholder={t('data-geo-cov.search')}
      />
      <DynamicCheckboxFilter
        filterOptions={['CSV', 'JSON', 'XML']}
        name={<FilterText text={t('data-format.name')} />}
        searchPlaceholder={t('data-format.search')}
      />
      <DynamicCheckboxFilter
        filterOptions={['ETALAB', 'LO-FR-2_0', 'Licence 3']}
        name={<FilterText text={t('data-licence.name')} />}
        searchPlaceholder={t('data-licence.search')}
      />
    </div>
  )
}
