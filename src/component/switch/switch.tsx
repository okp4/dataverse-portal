import type { FC } from 'react'
import * as RSwitch from '@radix-ui/react-switch'
import './switch.scss'

type SwitchProps = {
  isChecked: boolean
  onCheckedChange: (checked?: boolean) => void
  icons: {
    checked: JSX.Element
    notChecked: JSX.Element
  }
}

export const Switch: FC<SwitchProps> = ({
  isChecked,
  onCheckedChange,
  icons: { notChecked, checked }
}) => (
  <RSwitch.Root
    checked={isChecked}
    className="okp4-dataverse-portal-switch-main"
    onCheckedChange={onCheckedChange}
  >
    <RSwitch.Thumb className="okp4-dataverse-portal-switch-thumb">
      {isChecked ? checked : notChecked}
    </RSwitch.Thumb>
  </RSwitch.Root>
)
