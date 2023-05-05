import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'
import uuid from 'short-uuid'
import { useNotificationStore } from '@/ui/store'
import type { NotificationType } from '@/domain/notification/entity'
import { toEffectfulObject } from '@/util/effect'
import type { ActionType } from '@/ui/component/toast/toast'
import '@/ui/component/notification/i18n'

type DispatchNotificationInput = {
  type: NotificationType
  titleKey: string
  messageKey?: string
  action?: ActionType
}
type DispatchNotification = (input: DispatchNotificationInput) => void

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
    ({
      type,
      titleKey,
      messageKey,
      action
    }: {
      type: NotificationType
      titleKey: string
      messageKey?: string
      action?: ActionType
    }) => {
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
