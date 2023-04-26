/* eslint-disable max-lines-per-function */
import type { Eq } from 'fp-ts/lib/Eq'
import { struct } from 'fp-ts/lib/Eq'
import type { Option } from 'fp-ts/lib/Option'

export type NotificationID = string
export type NotificationType = 'success' | 'info' | 'warning' | 'error'

export type Notification = {
  id: NotificationID
  type: NotificationType
  title: string
  message: Option<string>
}

export type Notifications = Notification[]

export const eqNotificationID: Eq<NotificationID> = {
  equals: (n1, n2) => n1 === n2
}

export const eqNotification: Eq<Notification> = struct({
  id: eqNotificationID
})
