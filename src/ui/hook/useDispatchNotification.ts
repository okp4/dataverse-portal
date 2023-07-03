import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'
import uuid from 'short-uuid'
import { useNotificationStore } from '@/ui/store'
import type { ActionType } from '@/ui/store'
import type { NotificationType } from '@/domain/notification/value-object'
import { toEffectfulObject } from '@/util/effect'
import '@/ui/component/notification/i18n'

export type DispatchNotificationInput = {
  type: NotificationType
  titleKey: string
  messageKey?: string
  action?: ActionType
}
export type DispatchNotification = (input: DispatchNotificationInput) => void

export const useDispatchNotification = (): DispatchNotification => {
  const { t } = useTranslation('notification')
  const { reportNotification, hasReportedNotificationWithAction } = toEffectfulObject(
    useNotificationStore(
      state => ({
        reportNotification: state.reportNotification,
        hasReportedNotificationWithAction: state.hasReportedNotificationWithAction
      }),
      shallow
    )
  )

  const dispatchNotification = useCallback(
    ({ type, titleKey, messageKey, action }: DispatchNotificationInput) => {
      if (hasReportedNotificationWithAction()) return

      reportNotification({
        id: uuid.generate(),
        type,
        title: t(titleKey),
        ...(messageKey && { message: t(messageKey) }),
        ...(action && { action })
      })
    },
    [reportNotification, hasReportedNotificationWithAction, t]
  )

  return dispatchNotification
}
