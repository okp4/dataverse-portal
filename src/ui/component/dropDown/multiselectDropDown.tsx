import type { FC } from 'react'
import { useMemo, useCallback, useState } from 'react'
import { SearchBar } from '@/ui/component/searchbar/searchbar'
import { isSubstringOf } from '@/util/util'
import { Tag } from '@/ui/component/tag/tag'
import { DynamicCheckbox } from '@/ui/view/dataverse/component/dynamicCheckbox/dynamicCheckbox'
import { NoResultFound } from '@/ui/view/dataverse/component/noResultFound/noResultFound'
import { Okp4Modal } from '@/ui/view/modal/okp4-modal'
import type { CheckboxOption } from '@/ui/component/checkbox/checkbox'
import { Checkbox } from '@/ui/component/checkbox/checkbox'
import { DropDown } from './dropDown'
import './dropDown.scss'
import './multiselectDropDown.scss'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

type MultiselectDropdownModalProps = {
  label: string
  options: string[]
  value: string[]
  handleClearAll: () => void
  handleCheckedChange: ({ value }: Pick<CheckboxOption, 'value'>) => () => void
  handleCloseModal: () => void
  isModalOpen: boolean
}

// eslint-disable-next-line max-lines-per-function
const MultiselectDropdownModal: FC<MultiselectDropdownModalProps> = ({
  label,
  options,
  value,
  handleClearAll,
  handleCheckedChange,
  handleCloseModal,
  isModalOpen
}) => {
  const { t } = useTranslation('common')

  return (
    <Okp4Modal
      bottomElement={
        <div className="okp4-dataverse-portal-modal-bottom-element">
          <button
            className="okp4-dataverse-portal-modal-bottom-element-button"
            onClick={handleCloseModal}
          >
            {/**TODO: Button component */}
            {t('actions.close')}
          </button>
          {/**TODO: Button component */}
          <button
            className="okp4-dataverse-portal-modal-bottom-element-button"
            onClick={handleClearAll}
          >
            {t('actions.clearAll')}
          </button>
        </div>
      }
      closeOnEsc
      isCentered
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      topElement={<h2>{label}</h2>}
    >
      {options.map(option => (
        <div
          className={classNames('okp4-dataverse-portal-dynamic-checkbox', {
            checked: value.includes(option)
          })}
          key={option}
        >
          <Checkbox
            checked={value.includes(option)}
            id={option}
            name={option}
            onCheckedChange={handleCheckedChange({ value: option })}
            value={option}
          />
          <label className="okp4-dataverse-portal-dynamic-checkbox-label" htmlFor={option}>
            <span className="okp4-dataverse-portal-dynamic-checkbox-label-text">{option}</span>
          </label>
        </div>
      ))}
    </Okp4Modal>
  )
}

type SelectionItemType = 'checkbox'

export type MultiselectDropDownProps = {
  label: string
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
  onChange: (value: string) => void
  handleShowAllOptions?: (event: React.MouseEvent) => void
}

// eslint-disable-next-line max-lines-per-function
const MultiselectDropDownField: FC<MultiselectDropDownFieldProps> = ({
  value,
  onChange,
  placeholder,
  handleShowAllOptions
}) => {
  const handleDelete = useCallback(
    (value: string) => (): void => {
      onChange(value)
    },
    [onChange]
  )

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
          onDelete={handleDelete(valueElement)}
          tagName={valueElement}
        />
      ))}
      {value.length - maxDisplayedTags > 0 && (
        <div
          aria-label="Show all options"
          className="okp4-dataverse-portal-multiselect-dropdown-field-list-additional-item-wrapper"
          onClick={handleShowAllOptions}
          role="button"
          tabIndex={0}
        >
          <Tag
            classes={{
              main: 'okp4-dataverse-portal-multiselect-dropdown-field-list-additional-item'
            }}
            tagName={`+${value.length - maxDisplayedTags}`}
          />
        </div>
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

// eslint-disable-next-line max-lines-per-function
export const MultiselectDropDown: FC<MultiselectDropDownProps> = ({
  label,
  placeholder,
  value,
  options,
  onChange,
  searchPlaceholder,
  selectionType,
  maxSearchResults = maxDisplayedSearchResults
}) => {
  const [isModalOpen, setModalOpen] = useState(false)

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
  }, [])

  const handleOpenModal = useCallback((event: React.MouseEvent) => {
    event.stopPropagation()
    setModalOpen(true)
  }, [])

  const handleClearAll = useCallback(() => {
    value.forEach(onChange)
  }, [value, onChange])

  const handleCheckedChange = useCallback(
    ({ value }: Pick<CheckboxOption, 'value'>) =>
      (): void => {
        onChange(value)
      },
    [onChange]
  )

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
        content={
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
        contentClassName="okp4-dataverse-portal-multiselect-dropdown-options"
        trigger={
          <MultiselectDropDownField
            handleShowAllOptions={handleOpenModal}
            onChange={onChange}
            placeholder={placeholder}
            value={value}
          />
        }
        triggerClassName="okp4-dataverse-portal-multiselect-dropdown-field"
      />
      <MultiselectDropdownModal
        handleCheckedChange={handleCheckedChange}
        handleClearAll={handleClearAll}
        handleCloseModal={handleCloseModal}
        isModalOpen={isModalOpen}
        label={label}
        options={options}
        value={value}
      />
    </div>
  )
}
