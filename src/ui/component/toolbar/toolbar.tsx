import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'
import { useBreakpoint } from '@/ui/hook/useBreakpoint'
import { useAppStore } from '@/ui/store/appStore'
import type { Theme } from '@/ui/store/slice/theme.slice'
import { Okp4Logo } from '../logo/okp4Logo'
import { Button } from '../button/button'
import { Icon } from '../icon/icon'
import './toolbar.scss'
import './i18n/index'

type BurgerProps = {
  expandSidebar: () => void
  theme: Theme
}

type WalletButtonProps = {
  isSmallScreen: boolean
  label: string
}

const BurgerMenu = ({ expandSidebar, theme }: BurgerProps): JSX.Element => (
  <div className="okp4-dataverse-portal-burger-menu" onClick={expandSidebar}>
    <Button iconButtonOnly={<Icon name={`burger-menu-${theme}`} />} variant="tertiary" />
  </div>
)

const WalletButton = ({ isSmallScreen, label }: WalletButtonProps): JSX.Element => (
  <div className="okp4-dataverse-portal-wallet">
    {isSmallScreen ? (
      <Button
        iconButtonOnly={
          <div className="okp4-dataverse-portal-wallet-icon">
            <Icon name="wallet" />
          </div>
        }
        variant="tertiary"
      />
    ) : (
      <Button icons={{ startIcon: <Icon name="wallet" /> }} label={label} variant="tertiary" />
    )}
  </div>
)

export const Toolbar: FC = () => {
  const { t } = useTranslation('toolbar')
  const { isMobile, isTablet } = useBreakpoint()
  const isSmallScreen = isMobile || isTablet
  const { expandSidebar, isSidebarExpanded, theme } = useAppStore(
    state => ({
      expandSidebar: state.expandSidebar,
      isSidebarExpanded: state.isSidebarExpanded,
      theme: state.theme
    }),
    shallow
  )

  return (
    <div className="okp4-dataverse-portal-toolbar-main">
      {isSmallScreen && (
        <>
          {!isSidebarExpanded && <BurgerMenu expandSidebar={expandSidebar} theme={theme} />}
          <div className="okp4-dataverse-portal-toolbar-logo">
            <Okp4Logo />
          </div>
        </>
      )}
      <WalletButton isSmallScreen={isSmallScreen} label={t('toolbar.connectWallet')} />
    </div>
  )
}
