import { dataverseAggregate } from '@/domain/dataverse/aggregate'
import type { DataverseStore } from '@/domain/dataverse/aggregate'
import { NotificationAggregate, notificationAggregate } from '@/domain/notification/aggregate'
import { sparqlGateway } from '@/infra/dataverse/sparql/sparqlGateway'
import { StoreApi, useStore } from 'zustand'

export const dataverseStore = dataverseAggregate(sparqlGateway) as StoreApi<DataverseStore>

const notificationStore = notificationAggregate()()
export const useNotificationStore = <T>(
  selector: (state: NotificationAggregate) => T,
  equals?: (a: T, b: T) => boolean
): T => useStore(notificationStore, selector, equals)
