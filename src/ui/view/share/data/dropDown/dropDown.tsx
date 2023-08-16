import type { FC } from 'react'
import { useMemo, useCallback, useState, useRef, useEffect } from 'react'
import { SearchBar } from '@/ui/component/searchbar/searchbar'
import { isSubstringOf } from '@/util/util'
import { Tag } from '@/ui/component/tag/tag'
import { DynamicCheckbox } from '@/ui/view/dataverse/component/dynamicCheckbox/dynamicCheckbox'
import { NoResultFound } from '@/ui/view/dataverse/component/noResultFound/noResultFound'
import './dropDown.scss'
import { Popover } from '@/ui/component/popover/popover'

type SelectionItemType = 'checkbox'

export type DropDownProps = {
  placeholder: string
  value: string[]
  options: string[]
  searchPlaceholder: string
  selectionType: SelectionItemType
  onChange: (value: string) => void
  maxSearchResults?: number
}

const {
  dropDown: { maxDisplayedSearchResults }
} = APP_ENV

type DropDownInputProps = Pick<DropDownProps, 'value' | 'placeholder'> & {
  onDelete: (value: string) => void
}

// eslint-disable-next-line max-lines-per-function
const DropDownInput: FC<DropDownInputProps> = ({ value, onDelete, placeholder }) => {
  const tagsContainerRef = useRef<HTMLDivElement | null>(null)
  const tagsRef = useRef<HTMLDivElement[] | null>(null)
  const [quantityOfDisplayedTags, setQuantityOfDisplayedTags] = useState<number | null>(null)
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false)

  console.log(quantityOfDisplayedTags)

  useEffect(() => {
    if (tagsContainerRef.current) {
      tagsRef.current = Array.from(
        tagsContainerRef.current.querySelectorAll('.okp4-dataverse-portal-dropdown-input-list-item')
      )

      const availableSpace = tagsContainerRef.current.getBoundingClientRect().width
      const tagsWidths = tagsRef.current.map(tag => tag.getBoundingClientRect().width)
      const additionalItemWidth = 40 // must match the width of the additional item in the css
      let totalWidth = 0
      let _quantityOfDisplayedTags = 0

      for (let i = 0; i < tagsWidths.length; i++) {
        if (totalWidth + tagsWidths[i] <= availableSpace) {
          totalWidth += tagsWidths[i]
          _quantityOfDisplayedTags++
          continue
        }
        break
      }

      if (tagsWidths.length === 0) {
        setQuantityOfDisplayedTags(null)
        setIsOverflowing(false)
        return
      }

      if (tagsWidths.length === _quantityOfDisplayedTags) {
        console.log('nok')
        setQuantityOfDisplayedTags(_quantityOfDisplayedTags)
        setIsOverflowing(false)
        return
      }

      console.log('ok')

      if (totalWidth + additionalItemWidth <= availableSpace) {
        setQuantityOfDisplayedTags(_quantityOfDisplayedTags)
        setIsOverflowing(true)
        return
      }

      setQuantityOfDisplayedTags(_quantityOfDisplayedTags - 1)
      setIsOverflowing(true)
    }
  }, [value])

  return (
    <div className="okp4-dataverse-portal-dropdown-input" ref={tagsContainerRef}>
      {quantityOfDisplayedTags !== null && value.length ? (
        <div className="okp4-dataverse-portal-dropdown-input-list">
          {value.map((valueElement, index) => (
            // {value.slice(0, quantityOfDisplayedTags).map(valueElement => (
            // {value.slice(0, quantityOfDisplayedTags).map(valueElement => (
            // {value.slice(0, Math.min(quantityOfDisplayedTags, maxDisplayedTags)).map(valueElement => (
            <Tag
              classes={{
                main: `okp4-dataverse-portal-dropdown-input-list-item ${
                  quantityOfDisplayedTags <= index && 'hidden'
                }`
              }}
              key={valueElement}
              onDelete={onDelete}
              tagName={valueElement}
            />
          ))}
          {isOverflowing && (
            <Tag
              classes={{ main: 'okp4-dataverse-portal-dropdown-input-list-additional-item' }}
              tagName={`+${value.length - quantityOfDisplayedTags}`}
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

  const foundOptions = useMemo(
    () =>
      searchTerm.trim() === ''
        ? options.slice(0, maxSearchResults)
        : options.filter(option => isSubstringOf(searchTerm, option)).slice(0, maxSearchResults),
    [options, searchTerm, maxSearchResults]
  )

  return (
    <div className="okp4-dataverse-portal-dropdown-main">
      <Popover
        align="start"
        content={
          <div className="okp4-dataverse-portal-dropdown-content">
            <div className="okp4-dataverse-portal-dropdown-search-options">
              <SearchBar
                onSearch={handleSearch}
                placeholder={searchPlaceholder}
                value={searchTerm}
              />
              <DropDownOptions
                foundOptions={foundOptions}
                onChange={onChange}
                searchTerm={searchTerm}
                selectionType={selectionType}
                value={value}
              />
            </div>
          </div>
        }
        sideOffset={8}
        trigger={<DropDownInput onDelete={onChange} placeholder={placeholder} value={value} />}
        triggerClassName="okp4-dataverse-portal-dropdown-trigger"
        triggerIconName="chevron-sharp"
      />
    </div>
  )
}
