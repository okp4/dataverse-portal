import type { FC } from 'react'
import { useMemo, useCallback, useState } from 'react'
import { Collapsible } from '@/ui/component/collapsible/collapsible'
import { SearchBar } from '@/ui/component/searchbar/searchbar'
import { isSubstringOf } from '@/util/util'
import { Tag } from '@/ui/component/tag/tag'
import { DynamicCheckbox } from '@/ui/view/dataverse/component/dynamicCheckbox/dynamicCheckbox'
import { NoResultFound } from '@/ui/view/dataverse/component/noResultFound/noResultFound'
import './dropDown.scss'

type SelectionItemType = 'checkbox'

export type DropDownProps = {
  placeholder: string
  value: string[]
  options: string[]
  searchPlaceholder: string
  selectionType: SelectionItemType
  onChange: (value: string[]) => void
  maxSearchResults?: number
}

const {
  dropDown: { maxDisplayedSearchResults, maxDisplayedTags }
} = APP_ENV

type DropDownInputProps = Pick<DropDownProps, 'value' | 'placeholder'> & {
  onChange: (value: string) => void
}

const DropDownInput: FC<DropDownInputProps> = ({ value, onChange, placeholder }) => {
  const handleChange = useCallback(
    (value: string) => () => {
      onChange(value)
    },
    [onChange]
  )

  return (
    <div className="okp4-dataverse-portal-dropdown-input">
      {value.length ? (
        <div className="okp4-dataverse-portal-dropdown-input-selection">
          {value.slice(0, maxDisplayedTags).map(v => (
            <Tag
              classes={{ main: 'okp4-dataverse-portal-dropdown-input-selection-item' }}
              key={v}
              onDelete={handleChange(v)}
              tagName={v}
            />
          ))}
          {value.length > maxDisplayedTags && (
            <Tag
              classes={{ main: 'okp4-dataverse-portal-dropdown-input-selection-item' }}
              tagName={`+${value.length - maxDisplayedTags}`}
            />
          )}
        </div>
      ) : (
        <p className="okp4-dataverse-portal-dropdown-input-placeholder">{placeholder}</p>
      )}
    </div>
  )
}

type DropDownOptionsProps = Pick<DropDownProps, 'selectionType' | 'value'> & {
  foundOptions: string[]
  searchTerm: string
  onChange: (value: string) => void
}

const DropDownOptions: FC<DropDownOptionsProps> = ({
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

// eslint-disable-next-line max-lines-per-function
export const DropDown: FC<DropDownProps> = ({
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

  const handleChange = useCallback(
    (v: string) => {
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
        : options.filter(option => isSubstringOf(searchTerm, option)).slice(0, maxSearchResults),
    [options, searchTerm, maxSearchResults]
  )

  return (
    <div className="okp4-dataverse-portal-dropdown-main">
      <Collapsible
        content={
          <div className="okp4-dataverse-portal-dropdown-content">
            <SearchBar onSearch={handleSearch} placeholder={searchPlaceholder} value={searchTerm} />
            <DropDownOptions
              foundOptions={foundOptions}
              onChange={handleChange}
              searchTerm={searchTerm}
              selectionType={selectionType}
              value={value}
            />
          </div>
        }
        iconName="chevron-sharp"
        trigger={<DropDownInput onChange={handleChange} placeholder={placeholder} value={value} />}
        triggerClassName="okp4-dataverse-portal-dropdown-trigger"
      />
    </div>
  )
}
