import type { FC } from 'react'
import { useMemo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { Collapsible } from '@/ui/component/collapsible/collapsible'
import type { CheckboxOption } from '@/ui/component/checkbox/checkbox'
import { Checkbox } from '@/ui/component/checkbox/checkbox'
import { SearchBar } from '@/ui/component/searchbar/searchbar'
import { TextHighlighter } from '@/ui/component/textHighlighter/textHighlighter'
import { isSubstringOf } from '@/util/util'
import { Icon } from '@/ui/component/icon/icon'
import './checkboxFilter.scss'

const NoResultsFound: FC = () => {
  const { t } = useTranslation('common')
  return (
    <div className="okp4-dataverse-portal-checkbox-filter-no-results">
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

type CheckboxFilterProps = {
  filterName: string
  filterValues: string[]
  searchPlaceholder: string
  maxSearchResults?: number
}

// eslint-disable-next-line max-lines-per-function
export const CheckboxFilter: FC<CheckboxFilterProps> = ({
  filterName,
  filterValues,
  searchPlaceholder,
  maxSearchResults = 10
}) => {
  const createDefaultCheckboxOption = ({
    name,
    value
  }: Pick<CheckboxOption, 'name' | 'value'>): CheckboxOption => ({
    name,
    value,
    id: value,
    checked: false,
    disabled: false
  })

  const [searchTerm, setSearchTerm] = useState<string>('')

  const [checkboxOptions, setCheckboxOptions] = useState<CheckboxOption[]>(
    filterValues
      .map(value => createDefaultCheckboxOption({ name: filterName, value }))
      .sort((a, b) => a.value.localeCompare(b.value))
  )

  const handleSearch = useCallback(
    (searchTerm: string) => {
      setSearchTerm(searchTerm)
    },
    [setSearchTerm]
  )

  const handleCheckedChange = useCallback(
    (changedOption: CheckboxOption) => {
      setCheckboxOptions(prevCheckboxOptions => {
        const optionIndex = prevCheckboxOptions.findIndex(
          option => option.value === changedOption.value
        )
        if (optionIndex === -1) {
          return prevCheckboxOptions
        }
        return [
          ...prevCheckboxOptions.slice(0, optionIndex),
          changedOption,
          ...prevCheckboxOptions.slice(optionIndex + 1)
        ]
      })
    },
    [setCheckboxOptions]
  )

  const foundCheckboxOptions = useMemo(
    () =>
      checkboxOptions
        .filter(({ value }) => isSubstringOf(searchTerm, value))
        .slice(0, searchTerm.trim() === '' ? checkboxOptions.length : maxSearchResults),
    [checkboxOptions, searchTerm, maxSearchResults]
  )

  return (
    <div className="okp4-dataverse-portal-checkbox-filter-main">
      <Collapsible
        content={
          <div className="okp4-dataverse-portal-checkbox-filter">
            <SearchBar onSearch={handleSearch} placeholder={searchPlaceholder} value={searchTerm} />
            <div className="okp4-dataverse-portal-checkbox-filter-list">
              {foundCheckboxOptions.length > 0 ? (
                foundCheckboxOptions.map(({ checked, disabled, value }) => (
                  <div
                    className={classNames('okp4-dataverse-portal-searchable-checkbox', {
                      checked
                    })}
                    key={value}
                  >
                    <Checkbox
                      checked={checked}
                      disabled={disabled}
                      id={value}
                      name={filterName}
                      onCheckedChange={handleCheckedChange}
                      value={value}
                    />
                    <label
                      className={classNames('okp4-dataverse-portal-searchable-checkbox-label', {
                        disabled
                      })}
                      htmlFor={value}
                    >
                      <span className="okp4-dataverse-portal-searchable-checkbox-label-text">
                        <TextHighlighter
                          highlightClassName="okp4-dataverse-portal-searchable-checkbox-label-text-highlighted"
                          termToHighlight={searchTerm}
                          text={value}
                        />
                      </span>
                    </label>
                  </div>
                ))
              ) : (
                <div className="okp4-dataverse-portal-checkbox-filter-no-results-wrapper">
                  <NoResultsFound />
                </div>
              )}
            </div>
          </div>
        }
        iconName="chevron"
        open
        trigger={<FilterName>{filterName}</FilterName>}
        triggerClassName="okp4-dataverse-portal-checkbox-filter-trigger"
      />
    </div>
  )
}
