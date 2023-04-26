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
import { ForgetType } from '@/util/type'
import { devtools } from 'zustand/middleware'

type NotificationState = {
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

type NotificationAction = {
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

type NotificationQuery = {
  notifications: () => IO<NotificationsDTO>
}

type NotificationStore = NotificationState & NotificationAction & NotificationQuery
export type NotificationAggregate = ForgetType<NotificationState, NotificationStore>

export type NotificationOptions = {
  initialState: NotificationState
}

export const notificationAggregate: (
  options?: Partial<NotificationOptions>
) => Reader<void, StoreApi<NotificationAggregate>> =
  ({ initialState } = {}) =>
  () =>
    createStore(
      devtools(
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
    )
