import type { FC } from 'react'
import { useMemo, useCallback } from 'react'
import { useAppStore } from '@/ui/store/appStore'
import type { IconName } from '@/ui/component/icon/icon'
import { Toast } from '@/ui/component/toast/toast'
import type { NotificationType } from '@/domain/notification/entity'
import { toEffectfulObject } from '@/util/effect'
import { useNotificationStore } from '@/ui/store'
import type { DismissNotificationInput } from '@/domain/notification/aggregate'

export const Notification: FC = () => {
  const { notifications, dismissNotification } = toEffectfulObject(
    useNotificationStore(state => ({
      notifications: state.notifications,
      dismissNotification: state.dismissNotification
    }))
  )
  const theme = useAppStore(store => store.theme)
  const notificationIconByType = useMemo(
    () =>
      new Map<NotificationType, IconName>([
        ['error', 'error'],
        ['info', `info-${theme}`],
        ['success', 'check'],
        ['warning', 'warning']
      ]),
    [theme]
  )
  const handleDismiss = useCallback(
    (notificationInput: DismissNotificationInput) => {
      dismissNotification(notificationInput)
    },
    [dismissNotification]
  )

  return (
    <div className="okp4-dataverse-portal-notifications">
      {notifications().map(({ id, type, title, message, action }) => (
        <Toast
          action={action}
          duration={action ? Infinity : 3000}
          iconName={notificationIconByType.get(type)}
          id={id}
          key={id}
          message={message}
          onDismiss={handleDismiss}
          title={title}
          type={type}
        />
      ))}
    </div>
  )
}
