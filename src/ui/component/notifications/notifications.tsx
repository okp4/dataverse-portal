import type { FC } from 'react'
import { useMemo, useCallback } from 'react'
import { useAppStore } from '@/ui/store/appStore'
import { Toast } from '@/ui/component/toast/toast'
import type { IconName } from '@/ui/component/icon/icon'
import { Snackbar } from '@/ui/component/snackbar/snackbar'
import { NotificationType } from '@/domain/notification/entity'
import { toEffectfulObject } from '@/util/effect'
import { useNotificationStore } from '@/ui/store'

export const Notifications: FC = () => {
  const { notifications, removeNotification } = toEffectfulObject(
    useNotificationStore(state => ({
      notifications: state.notifications,
      removeNotification: state.dismissNotification
    }))
  )
  const theme = useAppStore(store => store.theme)
  const severityForIcon = useMemo(
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
    (severity: NotificationType) => {
      // removeNotification(severity) TODO: fix me
    },
    [removeNotification]
  )

  return (
    <div className="okp4-dataverse-portal-notifications">
      {notifications().map(({ type, title, message }, index) => {
        return type === 'error' ? (
          <Snackbar
            /* action={action} TODO: add action to domain */
            description={message}
            iconName={severityForIcon.get(type)}
            key={index}
            onClose={handleClose}
            severity={type}
            title={title}
          />
        ) : (
          <Toast
            description={message}
            iconName={severityForIcon.get(type)}
            key={index}
            onClose={handleClose}
            severity={type}
            title={title}
          />
        )
      })}
    </div>
  )
}
