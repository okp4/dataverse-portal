import * as Notification from '@/domain/notification/aggregate'
import * as Wallet from '@/domain/wallet/domain'
import * as Dataverse from '@/domain/dataverse/domain'
import * as File from '@/domain/file/domain'
import * as Vocabulary from '@/domain/vocabulary/domain'
import * as Metadata from '@/domain/metadata/domain'
import * as App from './appStore'

import type { StoreApi } from 'zustand'
import { useStore } from 'zustand'
import { sparqlGateway } from '@/infra/dataverse/sparql/sparqlGateway'

export type ActionType = 'refresh' | 'keplrInstall'

const createStoreHook =
  <T extends object>(store: StoreApi<T>) =>
  <S>(selector: (state: T) => S, equals?: (a: S, b: S) => boolean): S =>
    useStore(store, selector, equals)

const notificationStore = Notification.notificationAggregate<ActionType>()()
export const useNotificationStore = createStoreHook(notificationStore)

const walletStore = Wallet.storeFactory()
export const useWalletStore = createStoreHook(walletStore)

const dataverseStore = Dataverse.storeFactory(sparqlGateway)
export const useDataverseStore = createStoreHook(dataverseStore)

const fileStore = File.storeFactory()
export const useFileStore = createStoreHook(fileStore)

const metadataStore = Metadata.storeFactory()
export const useMetadataStore = createStoreHook(metadataStore)

const appStore = App.storeFactory()
export const useAppStore = createStoreHook(appStore)

const vocabularyStore = Vocabulary.storeFactory()
export const useVocabularyStore = createStoreHook(vocabularyStore)
