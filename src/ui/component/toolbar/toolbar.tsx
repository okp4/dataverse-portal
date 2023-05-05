import { useCallback, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'
import classNames from 'classnames'
import { useBreakpoint } from '@/ui/hook/useBreakpoint'
import { useAppStore } from '@/ui/store/appStore'
import type { Theme } from '@/ui/store/slice/theme.slice'
import { useOnClickOutside } from '@/ui/hook/useOnClickOutside'
import { useOnKeyboard } from '@/ui/hook/useOnKeyboard'
import { Okp4Logo } from '@/ui/component/logo/okp4Logo'
import { Button } from '@/ui/component/button/button'
import { Icon } from '@/ui/component/icon/icon'
import './i18n/index'
import './toolbar.scss'

type BurgerProps = {
  expandSidebar: () => void
  theme: Theme
}

type WalletButtonProps = {
  isConnected: boolean
  isSmallScreen: boolean
  isWalletMenuOpen: boolean
  label: string
  onWalletMenuClick: () => void
}

type WalletMenuProps = {
  balance: string
  onLogOut: () => void
}

const WalletMenu: FC<WalletMenuProps> = ({ balance, onLogOut }) => {
  const { t } = useTranslation(['toolbar'])

  return (
    <div className="okp4-dataverse-portal-wallet-menu">
      <ul className="okp4-dataverse-portal-wallet-menu-list">
        <li className="okp4-dataverse-portal-wallet-menu-item balance">
          <Okp4Logo logoOnly />
          <p className="okp4-dataverse-portal-wallet-menu-balance-amount">{balance}</p>
        </li>
        <li className="okp4-dataverse-portal-wallet-menu-item disconnect" onClick={onLogOut}>
          <Icon name="log-out" />
          <p className="okp4-dataverse-portal-wallet-menu-disconnect">
            {t('toolbar.disconnectWallet')}
          </p>
        </li>
      </ul>
    </div>
  )
}

const BurgerMenu = ({ expandSidebar, theme }: BurgerProps): JSX.Element => (
  <div className="okp4-dataverse-portal-burger-menu" onClick={expandSidebar}>
    <Button iconButtonOnly={<Icon name={`burger-menu-${theme}`} />} variant="tertiary" />
  </div>
)

const WalletButton = ({
  isConnected,
  isSmallScreen,
  isWalletMenuOpen,
  label,
  onWalletMenuClick
}: WalletButtonProps): JSX.Element => {
  const theme = useAppStore(state => state.theme)

  const walletIcons = useMemo(
    () => ({
      startIcon: <Icon name="wallet" />,
      endIcon: isConnected ? (
        <div
          className={classNames(
            `okp4-dataverse-portal-wallet-expand ${isWalletMenuOpen ? 'rotate-down' : 'rotate-up'}`
          )}
        >
          <Icon name={`expand-down-${theme}`} />
        </div>
      ) : undefined
    }),
    [isConnected, isWalletMenuOpen, theme]
  )

  return (
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
        <Button
          icons={walletIcons}
          label={label}
          onClick={onWalletMenuClick}
          size="large"
          variant="tertiary"
        />
      )}
    </div>
  )
}

// eslint-disable-next-line max-lines-per-function
export const Toolbar: FC = () => {
  const { t } = useTranslation(['toolbar', 'common'])
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState<boolean>(false)
  const [isConnected, setIsConnected] = useState<boolean>(true)
  const menuRef = useRef<HTMLDivElement | null>(null)

  const handleLogOut = useCallback(() => {
    setIsConnected(!isConnected)
    setIsWalletMenuOpen(false)
  }, [isConnected])

  const handleWalletMenuClick = useCallback(() => {
    isConnected ? setIsWalletMenuOpen(!isWalletMenuOpen) : setIsConnected(true)
  }, [isConnected, isWalletMenuOpen])

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
  const balance = `831 ${t('common:know')}`

  const clickOutsideHandler = useCallback(() => {
    setIsWalletMenuOpen(false)
  }, [setIsWalletMenuOpen])

  const handleWalletMenuEscape = useCallback(
    (event: KeyboardEvent) => {
      event.key === 'Escape' && setIsWalletMenuOpen(false)
    },
    [setIsWalletMenuOpen]
  )

  useOnClickOutside<HTMLDivElement>(menuRef, clickOutsideHandler)
  useOnKeyboard(handleWalletMenuEscape)

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
      <div className="okp4-dataverse-portal-wallet-container" ref={menuRef}>
        <WalletButton
          isConnected={isConnected}
          isSmallScreen={isSmallScreen}
          isWalletMenuOpen={isWalletMenuOpen}
          label={isConnected ? '3J98t1Wp...EZ73' : t('toolbar:toolbar.connectWallet')}
          onWalletMenuClick={handleWalletMenuClick}
        />
        {isWalletMenuOpen && !isSmallScreen && (
          <WalletMenu balance={balance} onLogOut={handleLogOut} />
        )}
      </div>
    </div>
  )
}
