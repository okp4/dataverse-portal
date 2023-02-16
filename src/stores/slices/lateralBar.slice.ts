import type { StateCreator } from 'zustand'

export type LateralBarSlice = {
  isExpanded: boolean
  expand: () => void
  collapse: () => void
}

export const createLateralBarSlice: StateCreator<
  LateralBarSlice,
  [],
  [],
  LateralBarSlice
> = set => ({
  isExpanded: true,
  expand: (): void =>
    set(() => ({
      isExpanded: true
    })),
  collapse: (): void => set(() => ({ isExpanded: false }))
})
