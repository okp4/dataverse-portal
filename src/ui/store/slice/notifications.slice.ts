import type { StateCreator } from 'zustand'

export type NotificationsSlice = {
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  removeNotification: (severity: NotificationSeverity) => void
}

export type NotificationSeverity = 'success' | 'info' | 'warning' | 'error'
export type NotificationAction = 'refresh'
export type NotificationType = 'alert' | 'confirmation'

export type Notification = {
  type: NotificationType
  severity: NotificationSeverity
  title: string
  description?: string
  action?: NotificationAction
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
