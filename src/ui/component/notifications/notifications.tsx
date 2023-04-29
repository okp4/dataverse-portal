import type { FC } from 'react'
import { useMemo, useCallback } from 'react'
import { useAppStore } from '@/ui/store/appStore'
import type { IconName } from '@/ui/component/icon/icon'
import { Toast } from '@/ui/component/toast/toast'
import type { NotificationType } from '@/domain/notification/entity'
import { toEffectfulObject } from '@/util/effect'
import { useNotificationStore } from '@/ui/store'
import type { DismissNotificationInput } from '@/domain/notification/aggregate'

export const Notifications: FC = () => {
  const { notifications, dismissNotification } = toEffectfulObject(
    useNotificationStore(state => ({
      notifications: state.notifications,
      dismissNotification: state.dismissNotification
    }))
  )
  const theme = useAppStore(store => store.theme)
  const notificationTypeForIcon = useMemo(
    () =>
      new Map<NotificationType, IconName>([
        ['error', 'error'],
        ['info', `info-${theme}`],
        ['success', 'check'],
        ['warning', 'warning']
      ]),
    [theme]
  )
  const handleClose = useCallback(
    (notificationInput: DismissNotificationInput) => {
      dismissNotification(notificationInput)
    },
    [dismissNotification]
  )

  return (
    <div className="okp4-dataverse-portal-notifications">
      {notifications().map(({ id, type, title, message, action }, index) => (
        <Toast
          action={action}
          iconName={notificationTypeForIcon.get(type)}
          id={id}
          index={index}
          key={id}
          message={message}
          onClose={handleClose}
          title={title}
          type={type}
        />
      ))}
    </div>
  )
}
