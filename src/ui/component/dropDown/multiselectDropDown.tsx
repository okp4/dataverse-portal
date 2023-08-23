import type { FC } from 'react'
import { useMemo, useCallback, useState } from 'react'
import { SearchBar } from '@/ui/component/searchbar/searchbar'
import { isSubstringOf } from '@/util/util'
import { Tag } from '@/ui/component/tag/tag'
import { DynamicCheckbox } from '@/ui/view/dataverse/component/dynamicCheckbox/dynamicCheckbox'
import { NoResultFound } from '@/ui/view/dataverse/component/noResultFound/noResultFound'
import './dropDown.scss'
import './multiselectDropDown.scss'
import { DropDown } from './dropDown'

type SelectionItemType = 'checkbox'

export type MultiselectDropDownProps = {
  placeholder: string
  value: string[]
  options: string[]
  searchPlaceholder: string
  selectionType: SelectionItemType
  onChange: (value: string) => void
  maxSearchResults?: number
}

const {
  dropDown: { maxDisplayedSearchResults, maxDisplayedTags }
} = APP_ENV

type MultiselectDropDownFieldProps = Pick<MultiselectDropDownProps, 'value' | 'placeholder'> & {
  onDelete: (value: string) => void
}

const MultiselectDropDownField: FC<MultiselectDropDownFieldProps> = ({
  value,
  onDelete,
  placeholder
}) => {
  return value.length ? (
    <div className="okp4-dataverse-portal-multiselect-dropdown-field-list">
      {value.map((valueElement, index) => (
        <Tag
          classes={{
            main: `okp4-dataverse-portal-multiselect-dropdown-field-list-item ${
              maxDisplayedTags <= index && 'hidden'
            }`
          }}
          key={valueElement}
          onDelete={onDelete}
          tagName={valueElement}
        />
      ))}
      {value.length - maxDisplayedTags > 0 && (
        <Tag
          classes={{
            main: 'okp4-dataverse-portal-multiselect-dropdown-field-list-additional-item'
          }}
          tagName={`+${value.length - maxDisplayedTags}`}
        />
      )}
    </div>
  ) : (
    <p className="okp4-dataverse-portal-dropdown-field-placeholder">{placeholder}</p>
  )
}

type MultiselectDropDownOptionsProps = Pick<MultiselectDropDownProps, 'selectionType' | 'value'> & {
  foundOptions: string[]
  searchTerm: string
  onChange: (value: string) => void
}

const MultiselectDropDownOptions: FC<MultiselectDropDownOptionsProps> = ({
  foundOptions,
  selectionType,
  searchTerm,
  value,
  onChange
}) => {
  const handleChange = useCallback(
    ({ value }: { value: string }): void => {
      onChange(value)
    },
    [onChange]
  )

  return (
    <div className="okp4-dataverse-portal-dropdown-options-list">
      {foundOptions.length ? (
        foundOptions.map(option => {
          switch (selectionType) {
            case 'checkbox':
              return (
                <DynamicCheckbox
                  checked={value.includes(option)}
                  highlightedTerm={searchTerm}
                  key={option}
                  name={option}
                  onCheckedChange={handleChange}
                  value={option}
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
  )
}

export const MultiselectDropDown: FC<MultiselectDropDownProps> = ({
  placeholder,
  value,
  options,
  onChange,
  searchPlaceholder,
  selectionType,
  maxSearchResults = maxDisplayedSearchResults
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleSearch = useCallback(
    (searchTerm: string) => {
      setSearchTerm(searchTerm)
    },
    [setSearchTerm]
  )

  const foundOptions = useMemo(
    () =>
      searchTerm.trim() === ''
        ? options.slice(0, maxSearchResults)
        : options.filter(option => isSubstringOf(searchTerm, option)).slice(0, maxSearchResults),
    [options, searchTerm, maxSearchResults]
  )

  return (
    <div className="okp4-dataverse-portal-multiselect-dropdown-main">
      <DropDown
        field={
          <MultiselectDropDownField onDelete={onChange} placeholder={placeholder} value={value} />
        }
        fieldClassName="okp4-dataverse-portal-multiselect-dropdown-field"
        options={
          <div className="okp4-dataverse-portal-dropdown-search-options">
            <SearchBar onSearch={handleSearch} placeholder={searchPlaceholder} value={searchTerm} />
            <MultiselectDropDownOptions
              foundOptions={foundOptions}
              onChange={onChange}
              searchTerm={searchTerm}
              selectionType={selectionType}
              value={value}
            />
          </div>
        }
        optionsClassName="okp4-dataverse-portal-multiselect-dropdown-options"
      />
    </div>
  )
}
