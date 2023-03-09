import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type StatsAggregate = {
  dataspacesCreatedNb: number
  datasetsSharedNb: number
  servicesSharedNb: number
}

export const useStatsAggregate = create<StatsAggregate, [['zustand/immer', never]]>(
  immer(() => ({
    dataspacesCreatedNb: 2,
    datasetsSharedNb: 18,
    servicesSharedNb: 5
  }))
)
