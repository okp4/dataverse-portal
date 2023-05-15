import type { NotificationType } from '@/ui/component/notification/notification'
import type { ActionType } from '@/ui/store'

export type WalletConnectionError =
  | 'wallet-not-found'
  | 'chain-not-found'
  | 'wallet-not-available'
  | 'user-rejected'
  | 'unknown'

export type NotificationData = {
  message: string
  title: string
  type: NotificationType
  action?: ActionType
}

export const walletErrorData = (error: WalletConnectionError): NotificationData => {
  switch (error) {
    case 'wallet-not-available':
      return {
        action: 'keplrInstall',
        message: 'notification:warning.extensionRequired',
        title: 'notification:warning.extensionMissing',
        type: 'warning'
      }
    case 'chain-not-found':
      return {
        message: 'notification:error.walletNetworkError',
        title: 'notification:error.walletConnectionError',
        type: 'error'
      }
    case 'user-rejected':
      return {
        message: 'notification:error.walletConnectionRejected',
        title: 'notification:error.walletConnectionFailed',
        type: 'error'
      }
    case 'wallet-not-found':
      return {
        message: 'notification:error.walletNetworkError',
        title: 'notification:error.walletConnectionError',
        type: 'error'
      }
    case 'unknown':
      return {
        message: 'notification:error.walletNetworkError',
        title: 'notification:error.walletConnectionError',
        type: 'error'
      }
  }
}
