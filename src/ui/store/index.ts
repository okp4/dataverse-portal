import type { DataverseStore } from '@/domain/dataverse/aggregate'
import { dataverseAggregate } from '@/domain/dataverse/aggregate'
import * as Notification from '@/domain/notification/aggregate'
import * as Wallet from '@/domain/wallet/domain'
import { sparqlGateway } from '@/infra/dataverse/sparql/sparqlGateway'
import type { ActionType } from '@/ui/component/toast/toast'
import type { StoreApi } from 'zustand'
import { useStore } from 'zustand'

const createStoreHook = <T extends object>(
  store: StoreApi<T>,
) => <S>(
  selector: (state: T) => S,
  equals?: (a: S, b: S) => boolean,
): S => useStore(store, selector, equals)

export const dataverseStore = dataverseAggregate(sparqlGateway) as StoreApi<DataverseStore>

const notificationStore = Notification.notificationAggregate<ActionType>()()
export const useNotificationStore = createStoreHook(notificationStore)

const walletStore = Wallet.storeFactory()
export const useWalletStore = createStoreHook(walletStore)
