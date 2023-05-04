/* eslint-disable max-lines-per-function */
import type { Eq } from 'fp-ts/lib/Eq'
import type { Option } from 'fp-ts/lib/Option'

export type NotificationID = string
export type NotificationType = 'success' | 'info' | 'warning' | 'error'
export type ActionType = 'refresh'

export type Notification<T> = {
  id: NotificationID
  type: NotificationType
  title: string
  message: Option<string>
  action: Option<T>
}

export type Notifications<T> = Notification<T>[]

export const eqNotificationID: Eq<NotificationID> = {
  equals: (n1, n2) => n1 === n2
}

export const eqNotification: Eq<{ id: NotificationID }> = {
  equals: (n1, n2) => eqNotificationID.equals(n1.id, n2.id)
}
