import { dataverseAggregate } from '@/domain/dataverse/aggregate'
import type { DataverseStore } from '@/domain/dataverse/aggregate'
import { sparqlGateway } from '@/infra/dataverse/sparql/sparqlGateway'
import type { StoreApi } from 'zustand'

export const dataverseStore = dataverseAggregate(sparqlGateway) as StoreApi<DataverseStore>
