import type { FC } from 'react'
import type { DropDownProps } from '../dropDown'
import { DynamicCheckbox } from '@/ui/view/dataverse/component/dynamicCheckbox/dynamicCheckbox'
import { NoResultFound } from '@/ui/view/dataverse/component/noResultFound/noResultFound'

interface OptionsListProps extends Pick<DropDownProps, 'visibleItems' | 'selectionType' | 'value'> {
  foundOptions: string[]
  searchTerm: string
  handleChange: (v: string) => () => void
}
export const OptionsList: FC<OptionsListProps> = ({
  visibleItems,
  foundOptions,
  selectionType,
  searchTerm,
  value,
  handleChange
}) => (
  <div className="okp4-dataverse-portal-dropdown-options-list" data-visible-items={visibleItems}>
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
                onCheckedChange={handleChange(v)}
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
)
