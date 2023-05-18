import type { FC } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { identity, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as S from 'fp-ts/string'
import * as A from 'fp-ts/Array'
import { contramap as ordContramap } from 'fp-ts/lib/Ord'
import type { Ord } from 'fp-ts/Ord'
import { Collapsible } from '@/ui/component/collapsible/collapsible'
import type { CheckboxOption } from '@/ui/component/searchableCheckbox/searchableCheckbox'
import { SearchableCheckbox } from '@/ui/component/searchableCheckbox/searchableCheckbox'
import { SearchBar } from '@/ui/component/searchbar/searchbar'
import { Icon } from '@/ui/component/icon/icon'
import './dynamicCheckboxFilter.scss'

const NoResultsFound: FC = () => {
  const { t } = useTranslation('common')
  return (
    <div className="okp4-dataverse-portal-checkbox-filter-no-results">
      <Icon name="no-results" />
      <span>{t('noResultsFound')}</span>
    </div>
  )
}

type DynamicCheckboxFilterProps = {
  name: string | JSX.Element
  filterOptions: string[]
  searchPlaceholder: string
}

// eslint-disable-next-line max-lines-per-function
export const DynamicCheckboxFilter: FC<DynamicCheckboxFilterProps> = ({
  name,
  filterOptions,
  searchPlaceholder
}) => {
  const createCheckboxOption = (label: string): CheckboxOption => ({
    label,
    checked: false,
    disabled: false
  })

  const ordLabel: Ord<string> = S.Ord
  const ordByLabel = pipe(
    ordLabel,
    ordContramap((x: CheckboxOption) => x.label)
  )

  const [checkboxOptions, setCheckboxOptions] = useState<CheckboxOption[]>(
    pipe(filterOptions, A.map(createCheckboxOption), A.sort(ordByLabel))
  )

  const handleCheckedChange = useCallback(
    (changedOption: CheckboxOption) => {
      setCheckboxOptions(checkboxOptions =>
        pipe(
          checkboxOptions,
          A.findIndex(x => x.label === changedOption.label),
          O.fold(
            () => checkboxOptions,
            index =>
              pipe(
                checkboxOptions,
                A.modifyAt(index, () => changedOption),
                O.getOrElse(() => checkboxOptions)
              )
          )
        )
      )
    },
    [setCheckboxOptions]
  )

  const [searchTerm, setSearchTerm] = useState<string>('')

  const maxSearchResults = 10

  const createSubstringMatcher =
    (substring: string) =>
    (source: string): boolean =>
      pipe(S.toLowerCase(source), S.includes(S.toLowerCase(substring)))

  const matchSearchTerm = useMemo(() => createSubstringMatcher(searchTerm), [searchTerm])

  const handleSearch = useCallback(
    (searchTerm: string) => {
      setSearchTerm(searchTerm)
    },
    [setSearchTerm]
  )

  return (
    <div className="okp4-dataverse-portal-dynamic-checkbox-filter-main">
      <Collapsible open triggerText={name}>
        <div className="okp4-dataverse-portal-dynamic-checkbox-filter">
          <SearchBar onSearch={handleSearch} placeholder={searchPlaceholder} value={searchTerm} />
          <div className="okp4-dataverse-portal-checkbox-filter-list">
            {pipe(
              checkboxOptions,
              A.filter(({ label }) => matchSearchTerm(label)),
              S.trim(searchTerm) === '' ? identity : A.takeLeft(maxSearchResults),
              A.map(({ checked, disabled, label }) => (
                <SearchableCheckbox
                  checked={checked}
                  disabled={disabled}
                  key={label}
                  label={label}
                  onCheckedChange={handleCheckedChange}
                  searchTerm={searchTerm}
                />
              )),
              O.fromPredicate(A.isNonEmpty),
              O.getOrElse(() => [
                <div
                  className="okp4-dataverse-portal-checkbox-filter-no-results-wrapper"
                  key="no-results"
                >
                  <NoResultsFound />
                </div>
              ])
            )}
          </div>
        </div>
      </Collapsible>
    </div>
  )
}
