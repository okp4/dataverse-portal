import { dataverseAggregate } from '@/domain/dataverse/aggregate'
import type { DataverseStore } from '@/domain/dataverse/aggregate'
import { NotificationStore, notificationAggregate } from '@/domain/notification/aggregate'
import { sparqlGateway } from '@/infra/dataverse/sparql/sparqlGateway'
import { StoreApi, useStore } from 'zustand'

export const dataverseStore = dataverseAggregate(sparqlGateway) as StoreApi<DataverseStore>
export const notificationStore = notificationAggregate()()

