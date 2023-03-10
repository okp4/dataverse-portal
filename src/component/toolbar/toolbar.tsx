import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useBreakpoint } from '@/hook/useBreakpoint'
import { Okp4Logo } from '../logo/okp4Logo'
import { Button } from '../button/button'
import { Icon } from '../icon/icon'
import './toolbar.scss'
import './i18n/index'

const renderSmallToolbar = (isMobile: boolean, walletLargeButton: JSX.Element): JSX.Element => (
  <>
    <div className="okp4-dataverse-portal-toolbar-logo">
      <Okp4Logo />
    </div>
    {isMobile ? (
      <Button iconButtonOnly={<Icon name="wallet" />} variant="tertiary" />
    ) : (
      walletLargeButton
    )}
  </>
)

export const Toolbar: FC = () => {
  const { t } = useTranslation('toolbar')
  const { isMobile, isTablet } = useBreakpoint()

  const walletLargeButton = (
    <Button
      icons={{ startIcon: <Icon name="wallet" /> }}
      label={t('toolbar.connectWallet')}
      variant="tertiary"
    />
  )

  return (
    <div className="okp4-dataverse-portal-toolbar-main">
      {isMobile || isTablet ? renderSmallToolbar(isMobile, walletLargeButton) : walletLargeButton}
    </div>
  )
}
