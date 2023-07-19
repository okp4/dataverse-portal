import type { FC } from 'react'
import { useMemo, useCallback, useState } from 'react'
import { Collapsible } from '@/ui/component/collapsible/collapsible'
import { SearchBar } from '@/ui/component/searchbar/searchbar'
import { isSubstringOf } from '@/util/util'
import { OptionsList } from './components/optionsList'
import { Header } from './components/header'
import './dropDown.scss'

type SelectionItemType = 'checkbox'

export type DropDownProps = {
  placeholder: string
  value: string[]
  options: string[]
  searchPlaceholder: string
  selectionType: SelectionItemType
  onChange: (value: string[]) => void
  visibleItems?: 4 | 5 | 6
  maxSearchResults?: number
}

const {
  dropDown: { dropDownMaxSearchResults }
} = APP_ENV

// eslint-disable-next-line max-lines-per-function
export const DropDown: FC<DropDownProps> = ({
  placeholder,
  value,
  options,
  onChange,
  searchPlaceholder,
  selectionType,
  maxSearchResults = dropDownMaxSearchResults,
  visibleItems
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleSearch = useCallback(
    (searchTerm: string) => {
      setSearchTerm(searchTerm)
    },
    [setSearchTerm]
  )

  const handleChange = useCallback(
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
            <OptionsList
              foundOptions={foundOptions}
              handleChange={handleChange}
              searchTerm={searchTerm}
              selectionType={selectionType}
              value={value}
              visibleItems={visibleItems}
            />
          </div>
        }
        iconName="chevron-sharp"
        trigger={<Header handleChange={handleChange} placeholder={placeholder} value={value} />}
        triggerClassName="okp4-dataverse-portal-dropdown-trigger"
      />
    </div>
  )
}
