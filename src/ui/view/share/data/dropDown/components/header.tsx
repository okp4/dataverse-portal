import type { FC } from 'react'
import type { DropDownProps } from '../dropDown'
import { Tag } from '@/ui/component/tag/tag'

interface Header extends Pick<DropDownProps, 'value' | 'placeholder'> {
  handleChange: (v: string) => () => void
}

const {
  dropDown: { dropDownTagsDisplayLimit }
} = APP_ENV

export const Header: FC<Header> = ({ value, handleChange, placeholder }) => (
  <div className="okp4-dataverse-portal-dropdown-header">
    {value.length ? (
      <div className="okp4-dataverse-portal-dropdown-header-selection">
        {value.slice(0, dropDownTagsDisplayLimit).map(v => (
          <Tag
            classes={{ main: 'okp4-dataverse-portal-dropdown-header-selection-item' }}
            key={v}
            onDelete={handleChange(v)}
            tagName={v}
          />
        ))}
        {value.length > dropDownTagsDisplayLimit && (
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
)
