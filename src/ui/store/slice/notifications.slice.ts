import type { StateCreator } from 'zustand'

export type NotificationsSlice = {
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  removeNotification: (severity: NotificationSeverity) => void
}

export type NotificationSeverity = 'success' | 'info' | 'warning' | 'error'

export type Notification = {
  title: string
  severity: NotificationSeverity
  action?: 'refresh'
  description?: string
}

export const createNotificationsSlice: StateCreator<
  NotificationsSlice,
  [],
  [],
  NotificationsSlice
> = set => ({
  notifications: [],
  addNotification: (notification: Notification): void => {
    set(state => ({
      notifications: [...state.notifications, notification]
    }))
  },
  removeNotification: (severity: NotificationSeverity): void => {
    set(state => ({
      notifications: state.notifications.filter(notification => notification.severity !== severity)
    }))
  }
})
