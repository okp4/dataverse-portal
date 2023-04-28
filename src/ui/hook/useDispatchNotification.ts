import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'
import uuid from 'short-uuid'
import type { ActionType } from '@/ui/store'
import { useNotificationStore } from '@/ui/store'
import type { NotificationType } from '@/domain/notification/entity'
import { toEffectfulObject } from '@/util/effect'
import '@/ui/component/notifications/i18n'

type DispatchNotificationInput = {
  type: NotificationType
  titleKey: string
  messageKey?: string
  action?: ActionType
}
type DispatchNotification = (input: DispatchNotificationInput) => void

export const useDispatchNotification = (): DispatchNotification => {
  const { t } = useTranslation('notifications')
  const { reportNotification, notificationWithActionReported } = toEffectfulObject(
    useNotificationStore(
      state => ({
        reportNotification: state.reportNotification,
        notificationWithActionReported: state.notificationWithActionReported
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
      if (notificationWithActionReported()) return

      reportNotification({
        id: uuid.generate(),
        type,
        title: t(titleKey),
        ...(messageKey && { message: t(messageKey) }),
        ...(action && { action })
      })
    },
    [reportNotification, notificationWithActionReported, t]
  )

  return dispatchNotification
}
