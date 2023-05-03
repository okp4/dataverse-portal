import type { StoreApi } from 'zustand'
import { useStore } from 'zustand'
import { dataverseAggregate } from '@/domain/dataverse/aggregate'
import type { DataverseStore } from '@/domain/dataverse/aggregate'
import type { NotificationAggregate } from '@/domain/notification/aggregate'
import { notificationAggregate } from '@/domain/notification/aggregate'
import { sparqlGateway } from '@/infra/dataverse/sparql/sparqlGateway'
import type { ActionType} from '@/ui/component/toast/toast';
import { useStore } from 'zustand'
import * as Wallet from '@/domain/wallet/domain'

export const dataverseStore = dataverseAggregate(sparqlGateway) as StoreApi<DataverseStore>

const notificationStore = notificationAggregate<ActionType>()()
export const useNotificationStore = <T>(
  selector: (state: NotificationAggregate<ActionType>) => T,
  equals?: (a: T, b: T) => boolean
): T => useStore(notificationStore, selector, equals)

const walletStore = Wallet.storeFactory()
export const useWalletStore = <T>(
  selector: (state: Wallet.DomainAPI) => T,
  equals?: (a: T, b: T) => boolean
): T => useStore(walletStore, selector, equals)
