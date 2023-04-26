/* eslint-disable max-lines-per-function */
import { immer } from 'zustand/middleware/immer'
import { createStore } from 'zustand/vanilla'
import {
  Notification,
  NotificationID,
  NotificationType,
  Notifications,
  eqNotificationID
} from './entity'
import { IO } from 'fp-ts/lib/IO'
import { Reader } from 'fp-ts/lib/Reader'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { StoreApi, create } from 'zustand'
import { pipe } from 'fp-ts/lib/function'

export type NotificationState = {
  aggregate: Notifications
}

export type ReportNotificationInput = {
  id: NotificationID
  type: NotificationType
  title: string
  message?: string
}

export type DismissNotificationInput = {
  id: NotificationID
}

export type NotificationAction = {
  reportNotification: (input: ReportNotificationInput) => IO<void>
  dismissNotification: (input: DismissNotificationInput) => IO<void>
}

export type NotificationDTO = {
  id: NotificationID
  type: NotificationType
  title: string
  message?: string
}

export type NotificationsDTO = NotificationDTO[]

export type NotificationQuery = {
  notifications: () => IO<NotificationsDTO>
}

export type NotificationStore = NotificationState & NotificationAction & NotificationQuery

export type NotificationOptions = {
  initialState?: NotificationState
}

export const notificationAggregate: (
  options?: NotificationOptions
) => Reader<
  void,
  StoreApi<Pick<NotificationStore, Exclude<keyof NotificationStore, keyof NotificationState>>>
> =
  ({ initialState } = {}) =>
  () =>
    createStore(
      immer<NotificationStore>((set, get) => ({
        aggregate: pipe(
          O.fromNullable(initialState),
          O.map(it => it.aggregate),
          O.getOrElse<Notifications>(() => [])
        ),
        reportNotification:
          (input: ReportNotificationInput): IO<void> =>
          () => {
            set(state => ({
              aggregate: [
                ...state.aggregate,
                {
                  id: input.id,
                  type: input.type,
                  title: input.title,
                  message: O.fromNullable(input.message)
                }
              ]
            }))
          },
        dismissNotification:
          (input: DismissNotificationInput): IO<void> =>
          () => {
            set(state => ({
              aggregate: A.filter<Notification>(notification =>
                eqNotificationID.equals(notification.id, input.id)
              )(state.aggregate)
            }))
          },
        notifications: (): IO<NotificationsDTO> => () =>
          pipe(
            get().aggregate,
            A.map(it => ({
              id: it.id,
              type: it.type,
              title: it.title,
              message: O.toUndefined(it.message)
            }))
          )
      }))
    )
