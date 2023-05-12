import { forwardRef, useMemo, useCallback } from 'react'
import classNames from 'classnames'
import { pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import * as RCheckbox from '@radix-ui/react-checkbox'
import { Icon } from '@/ui/component/icon/icon'
import './searchableCheckbox.scss'

export type CheckboxOption = {
  label: string
  checked: boolean
  disabled: boolean
}

type SearchableCheckboxProps = CheckboxOption & {
  onCheckedChange: (option: CheckboxOption) => void
  searchTerm: string
}

const replaceSpacesWithDashes = S.replace(/\s+/g, '-')

export const SearchableCheckbox = forwardRef<HTMLDivElement, SearchableCheckboxProps>(
  // eslint-disable-next-line max-lines-per-function
  ({ checked, onCheckedChange, label, disabled, searchTerm }, ref) => {
    const handleCheckedChange = useCallback(() => {
      if (disabled) return
      onCheckedChange({
        checked: !checked,
        label,
        disabled
      })
    }, [checked, onCheckedChange, disabled, label])

    const id = useMemo(() => pipe(label, S.toLowerCase, replaceSpacesWithDashes), [label])

    const splitTextBySearchTerm = (text: string, searchTerm: string): string[] =>
      text.split(new RegExp(`(${searchTerm})`, 'gi'))

    const labelWithHighlightedSearchTerm = useMemo(
      (): JSX.Element[] =>
        pipe(
          splitTextBySearchTerm(label, searchTerm),
          A.mapWithIndex((index, part) =>
            pipe(
              O.guard(S.toLowerCase(part) === S.toLowerCase(searchTerm)),
              O.fold(
                () => <span key={index}>{part}</span>,
                () => (
                  <span className="highlight" key={index}>
                    {part}
                  </span>
                )
              )
            )
          )
        ),
      [searchTerm, label]
    )

    return (
      <div
        className={classNames('okp4-dataverse-portal-searchable-checkbox-main', {
          checked
        })}
        ref={ref}
      >
        <RCheckbox.Root
          checked={checked}
          className={classNames('okp4-dataverse-portal-searchable-checkbox-checkmark', {
            checked,
            disabled
          })}
          id={id}
          onCheckedChange={handleCheckedChange}
        >
          {checked ? <Icon name="checkbox-checked" /> : <Icon name="checkbox-empty" />}
        </RCheckbox.Root>
        <label
          className={classNames('okp4-dataverse-portal-searchable-checkbox-label', {
            disabled
          })}
          htmlFor={id}
        >
          <span className="okp4-dataverse-portal-searchable-checkbox-label-text">
            {labelWithHighlightedSearchTerm}
          </span>
        </label>
      </div>
    )
  }
)

SearchableCheckbox.displayName = 'SearchableCheckbox'
