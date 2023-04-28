/* eslint-disable max-lines-per-function */
import type { StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createStore } from 'zustand/vanilla'
import { devtools } from 'zustand/middleware'
import type { IO } from 'fp-ts/lib/IO'
import type { Reader } from 'fp-ts/lib/Reader'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import type { ForgetType } from '@/util/type'
import { eqNotification } from './entity'
import type { NotificationID, NotificationType, Notifications } from './entity'

type NotificationState<T> = {
  aggregate: Notifications<T>
}

export type ReportNotificationInput<T> = {
  id: NotificationID
  type: NotificationType
  title: string
  message?: string
  action?: T
}

export type DismissNotificationInput = {
  id: NotificationID
}

type NotificationAction<T> = {
  reportNotification: (input: ReportNotificationInput<T>) => IO<void>
  dismissNotification: (input: DismissNotificationInput) => IO<void>
  notificationWithActionReported: () => IO<boolean>
}

export type NotificationDTO<T> = {
  id: NotificationID
  type: NotificationType
  title: string
  message?: string
  action?: T
}

export type NotificationsDTO<T> = NotificationDTO<T>[]

type NotificationQuery<T> = {
  notifications: () => IO<NotificationsDTO<T>>
}

type NotificationStore<T> = NotificationState<T> & NotificationAction<T> & NotificationQuery<T>
export type NotificationAggregate<T> = ForgetType<NotificationState<T>, NotificationStore<T>>

export type NotificationOptions<T> = {
  initialState: NotificationState<T>
}

export const notificationAggregate =
  <T>({ initialState }: Partial<NotificationOptions<T>> = {}): Reader<
    void,
    StoreApi<NotificationAggregate<T>>
  > =>
  () =>
    createStore(
      devtools(
        immer<NotificationStore<T>>((set, get) => ({
          aggregate: initialState?.aggregate ?? [],
          reportNotification:
            (input: ReportNotificationInput<T>): IO<void> =>
            () => {
              set(state => ({
                aggregate: [
                  ...state.aggregate,
                  {
                    id: input.id,
                    type: input.type,
                    title: input.title,
                    message: O.fromNullable(input.message),
                    action: O.fromNullable(input.action)
                  }
                ]
              }))
            },
          dismissNotification:
            (input: DismissNotificationInput): IO<void> =>
            () => {
              set(state => ({
                aggregate: state.aggregate.filter(
                  it => !eqNotification.equals(it, { id: input.id })
                )
              }))
            },
          notificationWithActionReported: (): IO<boolean> => () =>
            pipe(
              get().aggregate,
              A.some(it => O.isSome(it.action))
            ),
          notifications: (): IO<NotificationsDTO<T>> => () =>
            pipe(
              get().aggregate,
              A.map(it => ({
                id: it.id,
                type: it.type,
                title: it.title,
                message: O.toUndefined(it.message),
                action: O.toUndefined(it.action)
              }))
            )
        })),
        {
          anonymousActionType: 'notificationAggregate',
          enabled: process.env.NODE_ENV === 'development'
        }
      )
    )
