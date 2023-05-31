import type { FC } from 'react'
import { useCallback } from 'react'
import classNames from 'classnames'
import * as RCheckbox from '@radix-ui/react-checkbox'
import { Icon } from '@/ui/component/icon/icon'
import './checkbox.scss'

export type CheckboxOption = {
  checked: boolean
  value: string
  id?: string
  name?: string
  disabled?: boolean
}

type CheckboxProps = CheckboxOption & {
  onCheckedChange: (checkboxAttributes: Pick<CheckboxOption, 'checked' | 'value' | 'name'>) => void
}

export const Checkbox: FC<CheckboxProps> = ({
  checked,
  value,
  id = value,
  name,
  disabled = false,
  onCheckedChange
}) => {
  const handleCheckedChange = useCallback(() => {
    if (disabled) return

    onCheckedChange({
      checked: !checked,
      value,
      name
    })
  }, [checked, onCheckedChange, disabled, value, name])

  return (
    <RCheckbox.Root
      checked={checked}
      className={classNames('okp4-dataverse-portal-checkbox-main', {
        checked,
        disabled
      })}
      disabled={disabled}
      id={id}
      name={name}
      onCheckedChange={handleCheckedChange}
      value={value}
    >
      <Icon name="checkbox" />
    </RCheckbox.Root>
  )
}
