import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../button/button'
import { Icon } from '../icon/icon'
import './toolbar.scss'
import './i18n/index'

export const Toolbar: FC = () => {
  const { t } = useTranslation('toolbar')
  return (
    <div className="okp4-dataverse-portal-toolbar-main">
      <Button
        icons={{ startIcon: <Icon name="wallet" /> }}
        label={t('toolbar.connectWallet')}
        variant="tertiary"
      />
    </div>
  )
}
