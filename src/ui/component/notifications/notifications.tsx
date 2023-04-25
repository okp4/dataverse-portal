import type { FC } from 'react'
import { useMemo, useCallback } from 'react'
import { useAppStore } from '@/ui/store/appStore'
import { Toast } from '@/ui/component/toast/toast'
import type { NotificationSeverity } from '@/ui/store/slice/notifications.slice'
import type { IconName } from '@/ui/component/icon/icon'
import { Snackbar } from '@/ui/component/snackbar/snackbar'

export const Notifications: FC = () => {
  const { notifications, removeNotification } = useAppStore(state => ({
    notifications: state.notifications,
    removeNotification: state.removeNotification
  }))
  const theme = useAppStore(store => store.theme)
  const severityForIcon = useMemo(
    () =>
      new Map<NotificationSeverity, IconName>([
        ['error', 'error'],
        ['info', `info-${theme}`],
        ['success', 'check'],
        ['warning', 'warning']
      ]),
    [theme]
  )
  const handleClose = useCallback(
    (severity: NotificationSeverity) => {
      removeNotification(severity)
    },
    [removeNotification]
  )

  return (
    <div className="okp4-dataverse-portal-notifications">
      {notifications.map(({ severity, title, description, type, action }, index) => {
        return type === 'alert' ? (
          <Snackbar
            action={action}
            description={description}
            iconName={severityForIcon.get(severity)}
            key={index}
            onClose={handleClose}
            severity={severity}
            title={title}
          />
        ) : (
          <Toast
            description={description}
            iconName={severityForIcon.get(severity)}
            key={index}
            onClose={handleClose}
            severity={severity}
            title={title}
          />
        )
      })}
    </div>
  )
}
