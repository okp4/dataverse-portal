import type { FC } from 'react'
import { useCallback } from 'react'
import classNames from 'classnames'
import { Checkbox } from '@/ui/component/checkbox/checkbox'
import { TextHighlighter } from '@/ui/component/textHighlighter/textHighlighter'
import type { SelectionOption } from '@/ui/view/dataverse/component/filters/selectionFilter/selectionFilter'
import './dynamicCheckbox.scss'

type DynamicCheckboxProps = {
  name: string
  value: string
  checked: boolean
  highlightedTerm: string
  disabled?: boolean
  onCheckedChange: (checkboxOption: Pick<SelectionOption, 'selected' | 'value' | 'name'>) => void
}

export const DynamicCheckbox: FC<DynamicCheckboxProps> = ({
  name,
  value,
  checked,
  highlightedTerm,
  disabled = false,
  onCheckedChange
}) => {
  const handleCheckedChange = useCallback(() => {
    if (disabled) return

    onCheckedChange({
      name,
      value,
      selected: !checked
    })
  }, [checked, onCheckedChange, disabled, value, name])

  return (
    <div
      className={classNames('okp4-dataverse-portal-dynamic-checkbox', {
        checked
      })}
      key={value}
    >
      <Checkbox
        checked={checked}
        disabled={disabled}
        id={value}
        name={name}
        onCheckedChange={handleCheckedChange}
        value={value}
      />
      <label
        className={classNames('okp4-dataverse-portal-dynamic-checkbox-label', {
          disabled
        })}
        htmlFor={value}
      >
        <span className="okp4-dataverse-portal-dynamic-checkbox-label-text">
          <TextHighlighter
            highlightClassName="okp4-dataverse-portal-dynamic-checkbox-label-text-highlighted"
            termToHighlight={highlightedTerm}
            text={value}
          />
        </span>
      </label>
    </div>
  )
}
