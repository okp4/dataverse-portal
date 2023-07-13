import type { FC } from 'react'
import { useMemo, useCallback, useState } from 'react'
import { Collapsible } from '@/ui/component/collapsible/collapsible'
import { SearchBar } from '@/ui/component/searchbar/searchbar'
import { isSubstringOf } from '@/util/util'
import { DynamicCheckbox } from '@/ui/view/dataverse/component/dynamicCheckbox/dynamicCheckbox'
import { NoResultFound } from '@/ui/view/dataverse/component/noResultFound/noResultFound'
import { Tag } from '../tag/tag'
import './dropDown.scss'

export type SelectionOption = {
  selected: boolean
  value: string
  name: string
  disabled: boolean
}

type SelectionItemType = 'checkbox'

type DropDownProps = {
  filterName: string
  filterValues: string[]
  searchPlaceholder: string
  selectionType: SelectionItemType
  maxSearchResults?: number
}

// eslint-disable-next-line max-lines-per-function
export const DropDown: FC<DropDownProps> = ({
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

  const selectedOptions = useMemo(
    () => filterOptions.filter(({ selected }) => selected),
    [filterOptions]
  )

  const TAGS_DISPLAY_LIMIT = 2

  return (
    <div className="okp4-dataverse-portal-dropdown-main">
      <Collapsible
        content={
          <div className="okp4-dataverse-portal-dropdown-content">
            <SearchBar onSearch={handleSearch} placeholder={searchPlaceholder} value={searchTerm} />
            <div className="okp4-dataverse-portal-dropdown-options-list">
              {foundFilterOptions.length ? (
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
                  className="okp4-dataverse-portal-dropdown-no-results-wrapper"
                  iconName="large-magnifier-with-cross"
                />
              )}
            </div>
          </div>
        }
        iconName="chevron-sharp"
        open
        trigger={
          <div className="okp4-dataverse-portal-dropdown-header">
            {selectedOptions.length ? (
              <div className="okp4-dataverse-portal-dropdown-header-selection">
                {selectedOptions.slice(0, TAGS_DISPLAY_LIMIT).map(({ value, name }) => (
                  <Tag
                    className="okp4-dataverse-portal-dropdown-header-selection-item"
                    key={value}
                    // eslint-disable-next-line react/jsx-no-bind
                    onDelete={(): void => handleSelectedChange({ selected: false, value, name })}
                    tagName={value}
                  />
                ))}
                {selectedOptions.length > TAGS_DISPLAY_LIMIT && (
                  <Tag
                    className="okp4-dataverse-portal-dropdown-header-selection-item"
                    tagName={`+${String(selectedOptions.length)}`}
                  />
                )}
              </div>
            ) : (
              <p className="okp4-dataverse-portal-dropdown-header-placeholder">{filterName}</p>
            )}
          </div>
        }
        triggerClassName="okp4-dataverse-portal-dropdown-trigger"
      />
    </div>
  )
}
