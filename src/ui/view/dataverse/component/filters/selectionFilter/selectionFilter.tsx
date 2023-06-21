import type { FC } from 'react'
import { useMemo, useCallback, useState } from 'react'
import { Collapsible } from '@/ui/component/collapsible/collapsible'
import { SearchBar } from '@/ui/component/searchbar/searchbar'
import { isSubstringOf } from '@/util/util'
import { DynamicCheckbox } from '@/ui/view/dataverse/component/dynamicCheckbox/dynamicCheckbox'
import { NoResultFound } from '@/ui/view/dataverse/component/noResultFound/noResultFound'
import './selectionFilter.scss'

export type SelectionOption = {
  selected: boolean
  value: string
  name: string
  disabled: boolean
}

type SelectionItemType = 'checkbox'

type FilterLabelProps = {
  label: string
}
export const FilterLabel: FC<FilterLabelProps> = ({ label }) => (
  <h3 className="okp4-dataverse-portal-dataverse-filter-label">{label}</h3>
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
  const createDefaultFilterOption = (value: string): SelectionOption => ({
    name: filterName,
    value,
    selected: false,
    disabled: false
  })

  const [searchTerm, setSearchTerm] = useState<string>('')

  const [filterOptions, setFilterOptions] = useState<SelectionOption[]>(
    filterValues
      .map(value => createDefaultFilterOption(value))
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
      setFilterOptions(prevFilterOptions =>
        prevFilterOptions.map(option =>
          option.value === changedOption.value
            ? { ...option, selected: changedOption.selected }
            : option
        )
      )
    },
    [setFilterOptions]
  )

  const foundFilterOptions = useMemo(
    () =>
      searchTerm.trim() === ''
        ? filterOptions
        : filterOptions
            .filter(({ value }) => isSubstringOf(searchTerm, value))
            .slice(0, maxSearchResults),
    [filterOptions, searchTerm, maxSearchResults]
  )

  return (
    <div className="okp4-dataverse-portal-selection-filter-main">
      <Collapsible
        content={
          <div className="okp4-dataverse-portal-selection-filter">
            <SearchBar onSearch={handleSearch} placeholder={searchPlaceholder} value={searchTerm} />
            <div className="okp4-dataverse-portal-selection-filter-options-list">
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
                <NoResultFound
                  className="okp4-dataverse-portal-selection-filter-no-results-wrapper"
                  iconName="large-magnifier-with-cross"
                />
              )}
            </div>
          </div>
        }
        iconName="chevron"
        open
        trigger={<FilterLabel label={filterName} />}
        triggerClassName="okp4-dataverse-portal-selection-filter-trigger"
      />
    </div>
  )
}
