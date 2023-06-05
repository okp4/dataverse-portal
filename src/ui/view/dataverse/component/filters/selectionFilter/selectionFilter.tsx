import type { FC } from 'react'
import { useMemo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Collapsible } from '@/ui/component/collapsible/collapsible'
import { SearchBar } from '@/ui/component/searchbar/searchbar'
import { isSubstringOf } from '@/util/util'
import { Icon } from '@/ui/component/icon/icon'
import { DynamicCheckbox } from '@/ui/view/dataverse/component/dynamicCheckbox/dynamicCheckbox'
import './selectionFilter.scss'

export type SelectionOption = {
  selected: boolean
  value: string
  name: string
  disabled: boolean
}

type SelectionItemType = 'checkbox'

const NoResultsFound: FC = () => {
  const { t } = useTranslation('common')
  return (
    <div className="okp4-dataverse-portal-selection-filter-no-results">
      <Icon name="large-magnifier-with-cross" />
      <span>{t('noResultsFound')}</span>
    </div>
  )
}

type FilterNameProps = {
  children: string
}
export const FilterName: FC<FilterNameProps> = ({ children }) => (
  <h3 className="okp4-dataverse-portal-dataverse-filter-name">{children}</h3>
)

type SelectionFilterProps = {
  filterName: string
  filterValues: string[]
  searchPlaceholder: string
  selectionType: SelectionItemType
  maxSearchResults?: number
}

// eslint-disable-next-line max-lines-per-function
export const SelectionFilter: FC<SelectionFilterProps> = ({
  filterName,
  filterValues,
  searchPlaceholder,
  selectionType,
  maxSearchResults = 10
}) => {
  const createDefaultFilterOption = ({
    name,
    value
  }: Pick<SelectionOption, 'name' | 'value'>): SelectionOption => ({
    name,
    value,
    selected: false,
    disabled: false
  })

  const [searchTerm, setSearchTerm] = useState<string>('')

  const [filterOptions, setFilterOptions] = useState<SelectionOption[]>(
    filterValues
      .map(value => createDefaultFilterOption({ name: filterName, value }))
      .sort((a, b) => a.value.localeCompare(b.value))
  )

  const handleSearch = useCallback(
    (searchTerm: string) => {
      setSearchTerm(searchTerm)
    },
    [setSearchTerm]
  )

  const handleSelectedChange = useCallback(
    (changedOption: Pick<SelectionOption, 'selected' | 'value' | 'name'>) => {
      setFilterOptions(prevFilterOptions => {
        const optionIndex = prevFilterOptions.findIndex(
          option => option.value === changedOption.value
        )
        if (optionIndex === -1) {
          return prevFilterOptions
        }
        return [
          ...prevFilterOptions.slice(0, optionIndex),
          { ...prevFilterOptions[optionIndex], ...changedOption },
          ...prevFilterOptions.slice(optionIndex + 1)
        ]
      })
    },
    [setFilterOptions]
  )

  const foundFilterOptions = useMemo(
    () =>
      filterOptions
        .filter(({ value }) => isSubstringOf(searchTerm, value))
        .slice(0, searchTerm.trim() === '' ? filterOptions.length : maxSearchResults),
    [filterOptions, searchTerm, maxSearchResults]
  )

  return (
    <div className="okp4-dataverse-portal-selection-filter-main">
      <Collapsible
        content={
          <div className="okp4-dataverse-portal-selection-filter">
            <SearchBar onSearch={handleSearch} placeholder={searchPlaceholder} value={searchTerm} />
            <div className="okp4-dataverse-portal-selection-filter-list">
              {foundFilterOptions.length > 0 ? (
                foundFilterOptions.map(({ selected, disabled, value }) => {
                  switch (selectionType) {
                    case 'checkbox':
                      return (
                        <DynamicCheckbox
                          checked={selected}
                          disabled={disabled}
                          highlightedTerm={searchTerm}
                          key={value}
                          name={filterName}
                          onCheckedChange={handleSelectedChange}
                          value={value}
                        />
                      )
                  }
                })
              ) : (
                <div className="okp4-dataverse-portal-selection-filter-no-results-wrapper">
                  <NoResultsFound />
                </div>
              )}
            </div>
          </div>
        }
        iconName="chevron"
        open
        trigger={<FilterName>{filterName}</FilterName>}
        triggerClassName="okp4-dataverse-portal-selection-filter-trigger"
      />
    </div>
  )
}
