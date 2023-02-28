import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export const useStatsAggregate = create(
  immer(() => ({
    dataspacesCreatedNb: 2,
    datasetsSharedNb: 18,
    servicesSharedNb: 5
  }))
)
