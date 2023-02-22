import type { FC } from 'react'
import { Button } from '../button/button'
import { Icon } from '../icon/icon'
import './toolbar.scss'

export const Toolbar: FC = () => {
  return (
    <div className="okp4-dataverse-portal-toolbar-main">
      <Button
        icons={{ startIcon: <Icon name="wallet" /> }}
        label="Connect my wallet"
        variant="tertiary"
      />
    </div>
  )
}
