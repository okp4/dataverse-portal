import type { FC } from 'react'
import { useMemo, useCallback, useState } from 'react'
import { Collapsible } from '@/ui/component/collapsible/collapsible'
import { SearchBar } from '@/ui/component/searchbar/searchbar'
import { isSubstringOf } from '@/util/util'
import { DynamicCheckbox } from '@/ui/view/dataverse/component/dynamicCheckbox/dynamicCheckbox'
import { NoResultFound } from '@/ui/view/dataverse/component/noResultFound/noResultFound'

import './dropDown.scss'
import { Tag } from '@/ui/component/tag/tag'

type SelectionItemType = 'checkbox'

type DropDownProps = {
  placeholder: string
  value: string[]
  options: string[]
  searchPlaceholder: string
  selectionType: SelectionItemType
  maxSearchResults?: number
  onChange: (value: string[]) => void
}

// eslint-disable-next-line max-lines-per-function
export const DropDown: FC<DropDownProps> = ({
  placeholder,
  value,
  options,
  onChange,
  searchPlaceholder,
  selectionType,
  maxSearchResults = APP_ENV.dropDownMaxSearchResults
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleSearch = useCallback(
    (searchTerm: string) => {
      setSearchTerm(searchTerm)
    },
    [setSearchTerm]
  )

  const handleSelectedChange = useCallback(
    (v: string) => () => {
      if (value.includes(v)) {
        onChange(value.filter(val => val !== v))
        return
      }

      onChange([...value, v])
    },
    [value, onChange]
  )

  const foundOptions = useMemo(
    () =>
      searchTerm.trim() === ''
        ? options
        : options.filter(v => isSubstringOf(searchTerm, v)).slice(0, maxSearchResults),
    [options, searchTerm, maxSearchResults]
  )

  return (
    <div className="okp4-dataverse-portal-dropdown-main">
      <Collapsible
        content={
          <div className="okp4-dataverse-portal-dropdown-content">
            <SearchBar onSearch={handleSearch} placeholder={searchPlaceholder} value={searchTerm} />
            <div className="okp4-dataverse-portal-dropdown-options-list">
              {foundOptions.length ? (
                foundOptions.map(v => {
                  switch (selectionType) {
                    case 'checkbox':
                      return (
                        <DynamicCheckbox
                          checked={value.includes(v)}
                          highlightedTerm={searchTerm}
                          key={v}
                          name={v}
                          onCheckedChange={handleSelectedChange(v)}
                          value={v}
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
            {value.length ? (
              <div className="okp4-dataverse-portal-dropdown-header-selection">
                {value.slice(0, APP_ENV.dropDownTagsDisplayLimit).map(v => (
                  <Tag
                    classes={{ main: 'okp4-dataverse-portal-dropdown-header-selection-item' }}
                    key={v}
                    onDelete={handleSelectedChange(v)}
                    tagName={v}
                  />
                ))}
                {value.length > APP_ENV.dropDownTagsDisplayLimit && (
                  <Tag
                    classes={{ main: 'okp4-dataverse-portal-dropdown-header-selection-item' }}
                    tagName={`+${String(value.length)}`}
                  />
                )}
              </div>
            ) : (
              <p className="okp4-dataverse-portal-dropdown-header-placeholder">{placeholder}</p>
            )}
          </div>
        }
        triggerClassName="okp4-dataverse-portal-dropdown-trigger"
      />
    </div>
  )
}
