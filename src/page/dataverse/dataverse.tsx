import { DataverseCard } from '@/component/card/dataverseCard/dataverseCard'
import type { DataverseCardProps } from '@/component/card/dataverseCard/dataverseCard'
import { useCallback, useState } from 'react'
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
    label: 'AG Open Data Space',
    description: 'Lorem ipsum dolor sit amet, consectetur '
  },
  {
    type: 'dataset',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description: 'Données publiques de météo'
  },
  {
    type: 'service',
    label: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip',
    description: 'Données publiques de météo'
  },
  {
    type: 'dataspace',
    label:
      'Vitae justo eget magna fermentum iaculis eu. Ullamcorper morbi tincidunt ornare massa eget egestas',
    description: 'Elementum metus magnis amet'
  },
  {
    type: 'dataset',
    label: 'This is a title that is much more letters and words',
    description: 'This is a description that is far too long to be written here in full.'
  },
  {
    type: 'service',
    label:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'dataspace',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description: 'Commodo dictumst porttitor at.'
  },
  {
    type: 'dataset',
    label:
      'Maecenas ultricies mi eget mauris pharetra et. Fermentum iaculis eu non diam phasellus.',
    description: 'Pellentesque.Ipsum odor amet'
  },
  {
    type: 'service',
    label: 'Id cursus metus aliquam eleifend',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'dataspace',
    label: 'Maecenas ultricies mi eget mauris pharetra et. Fermentum iaculis',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'dataset',
    label: 'Sed libero enim sed faucibus turpis.',
    description: 'Elementum metus magnis commodo dictumst'
  },
  {
    type: 'service',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'dataspace',
    label: 'Integer feugiat scelerisque varius morbi. Odio ut enim blandit volutpat maecenas vol',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'dataset',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'service',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'dataspace',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'dataset',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'service',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'dataspace',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'dataset',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  }
]

const initialState: FilterValue[] = ['all']

// eslint-disable-next-line max-lines-per-function
const Dataverse = (): JSX.Element => {
  const { t } = useTranslation('common')
  const theme = useAppStore(state => state.theme)
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useBreakpoint()
  const [selectedFilters, setSelectedFilters] = useState<FilterValue[]>(initialState)

  const addAllFilter = useCallback((): void => {
    setSelectedFilters(['all'])
  }, [])

  const removeFilter = useCallback(
    (filterToRemove: FilterValue): void => {
      const isAllOnlyFilter = selectedFilters.length === 1 && selectedFilters.includes('all')
      !isAllOnlyFilter &&
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
      filterToAdd === 'all' ? addAllFilter() : addFilterAndRemoveAllFilter(filterToAdd)
    },
    [addAllFilter, addFilterAndRemoveAllFilter]
  )

  const toggleFilter = useCallback(
    (filter: FilterValue) => () => {
      selectedFilters.includes(filter) ? removeFilter(filter) : addFilter(filter)
    },
    [addFilter, removeFilter, selectedFilters]
  )

  return (
    <div className="okp4-dataverse-portal-dataverse-page-main">
      <div className="okp4-dataverse-portal-dataverse-page-filters-container">
        {(isDesktop || isLargeDesktop) && (
          <div className="okp4-dataverse-portal-dataverse-page-filters">
            <h1>{t('filters')}</h1>
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
        )}
      </div>
      <div className="okp4-dataverse-portal-dataverse-page-catalog">
        <h1>{t('actions.explore')}</h1>
        {(isMobile || isTablet) && (
          <Button
            className="okp4-dataverse-portal-dataverse-page-filters-button"
            label={t('filters')}
            variant="primary"
          />
        )}
        <div className="okp4-dataverse-portal-dataverse-page-cards-container">
          {dataverseItems.map(({ type, label, description }) => (
            <DataverseCard description={description} key={label} label={label} type={type} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dataverse
