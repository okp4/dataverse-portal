import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { LateralBarSlice } from './slices/lateralBar.slice'
import { createLateralBarSlice } from './slices/lateralBar.slice'

export const useAppStore = create<LateralBarSlice>()(
  immer((...a) => ({
    ...createLateralBarSlice(...a)
  }))
)
