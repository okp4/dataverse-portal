import { useCallback, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'
import classNames from 'classnames'
import * as O from 'fp-ts/Option'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import { useBreakpoint } from '@/ui/hook/useBreakpoint'
import { useAppStore } from '@/ui/store/appStore'
import type { Theme } from '@/ui/store/slice/theme.slice'
import { useOnClickOutside } from '@/ui/hook/useOnClickOutside'
import { useOnKeyboard } from '@/ui/hook/useOnKeyboard'
import { Okp4Logo } from '@/ui/component/logo/okp4Logo'
import { Button } from '@/ui/component/button/button'
import { Icon } from '@/ui/component/icon/icon'
import { useWalletStore } from '@/ui/store'
import type { ActionType } from '@/ui/store'
import type { Wallet } from '@/domain/wallet/query'
import { keplrWalletGateway } from '@/infra/wallet/keplrGateway'
import { useDispatchNotification } from '@/ui/hook/useDispatchNotification'
import type { NotificationType } from '@/ui/component/notification/notification'
import type {
  ChainNotFoundError,
  UnknownError,
  WalletNotAvailableError,
  WalletNotFoundError,
  UserRejectedError
} from '@/domain/wallet/command'
import './i18n/index'
import './toolbar.scss'

type BurgerProps = {
  expandSidebar: () => void
  theme: Theme
}

type WalletButtonProps = {
  isWalletConnected: boolean
  isSmallScreen: boolean
  isWalletMenuOpen: boolean
  label: string
  onWalletMenuClick: () => void
}

type WalletMenuProps = {
  balance: string
  onLogOut: () => void
}

type WalletConnectionError =
  | ChainNotFoundError
  | UnknownError
  | WalletNotFoundError
  | WalletNotAvailableError
  | UserRejectedError

type NotificationData = {
  message: string
  title: string
  type: NotificationType
  action?: ActionType
}

const walletErrorData = (error: WalletConnectionError): NotificationData => {
  switch (error._tag) {
    case 'wallet-not-available':
      return {
        action: 'keplrInstall',
        message: 'notification:warning.extensionRequired',
        title: 'notification:warning.extensionMissing',
        type: 'warning'
      }
    case 'user-rejected':
      return {
        message: 'notification:error.walletConnectionRejected',
        title: 'notification:error.walletConnectionFailed',
        type: 'error'
      }
    case 'chain-not-found':
    case 'wallet-not-found':
    case 'unknown':
      return {
        message: 'notification:error.walletNetworkError',
        title: 'notification:error.walletConnectionError',
        type: 'error'
      }
  }
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
  isWalletConnected,
  isSmallScreen,
  isWalletMenuOpen,
  label,
  onWalletMenuClick
}: WalletButtonProps): JSX.Element => {
  const theme = useAppStore(state => state.theme)

  const walletIcons = useMemo(
    () => ({
      startIcon: <Icon name="wallet" />,
      endIcon: isWalletConnected ? (
        <div
          className={classNames(
            `okp4-dataverse-portal-wallet-expand ${isWalletMenuOpen ? 'rotate-down' : 'rotate-up'}`
          )}
        >
          <Icon name={`expand-down-${theme}`} />
        </div>
      ) : undefined
    }),
    [isWalletConnected, isWalletMenuOpen, theme]
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

const deps = {
  walletPorts: [keplrWalletGateway],
  chainInfos: APP_ENV.chains
}

// eslint-disable-next-line max-lines-per-function
export const Toolbar: FC = () => {
  const { t } = useTranslation(['toolbar', 'common', 'notification'])
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState<boolean>(false)
  const { isMobile, isTablet } = useBreakpoint()
  const isSmallScreen = isMobile || isTablet
  const menuRef = useRef<HTMLDivElement | null>(null)
  const dispatchNotification = useDispatchNotification()

  const { expandSidebar, isSidebarExpanded, theme } = useAppStore(
    state => ({
      expandSidebar: state.expandSidebar,
      isSidebarExpanded: state.isSidebarExpanded,
      theme: state.theme
    }),
    shallow
  )

  const { connectWalletForChain, disconnectWallet, wallet } = useWalletStore(state => ({
    disconnectWallet: state.disconnectWallet,
    connectWalletForChain: state.connectWalletForChain,
    wallet: state.wallet
  }))

  const handleWalletError = useCallback(
    (error: WalletConnectionError) => {
      const { action, message, title, type } = walletErrorData(error)
      dispatchNotification({
        type: type,
        titleKey: title,
        messageKey: message,
        action: action
      })
    },
    [dispatchNotification]
  )

  const handleWalletConnection = useCallback((): void => {
    pipe(
      deps,
      connectWalletForChain({
        walletId: keplrWalletGateway.id,
        chainId: APP_ENV.chains[0].id
      }),
      TE.mapLeft(handleWalletError)
    )()
  }, [connectWalletForChain, handleWalletError])

  const handleWalletDisconnection = useCallback((): void => {
    pipe(
      deps,
      disconnectWallet(),
      TE.mapLeft(handleWalletError),
      TE.chainIOK(() => () => setIsWalletMenuOpen(false))
    )()
  }, [disconnectWallet, handleWalletError])

  const handleWalletMenuClick = useCallback(() => {
    O.match(
      () => handleWalletConnection(),
      () => setIsWalletMenuOpen(!isWalletMenuOpen)
    )(wallet()())
  }, [handleWalletConnection, isWalletMenuOpen, wallet])

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

  const formatWalletAddress = (address: string): string =>
    `${address.slice(0, 8)}...${address.slice(-4)}`

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
          isSmallScreen={isSmallScreen}
          isWalletConnected={O.isSome(wallet()())}
          isWalletMenuOpen={isWalletMenuOpen}
          label={O.match(
            () => t('toolbar:toolbar.connectWallet'),
            (w: Wallet) => formatWalletAddress(w.accounts[0].address)
          )(wallet()())}
          onWalletMenuClick={handleWalletMenuClick}
        />
        {isWalletMenuOpen && !isSmallScreen && (
          <WalletMenu balance={balance} onLogOut={handleWalletDisconnection} />
        )}
      </div>
    </div>
  )
}
