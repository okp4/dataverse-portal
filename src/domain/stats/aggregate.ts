import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type StatsAggregate = {
  zonesCreatedNb: number
  datasetsSharedNb: number
  servicesSharedNb: number
  communityParticipantNb: number
}

export const useStatsAggregate = create<StatsAggregate, [['zustand/immer', never]]>(
  immer(() => ({
    zonesCreatedNb: 2,
    datasetsSharedNb: 18,
    servicesSharedNb: 5,
    communityParticipantNb: 34
  }))
)
