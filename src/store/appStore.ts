import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { ThemeSlice } from './slice/theme.slice'
import { createThemeSlice } from './slice/theme.slice'

export const useAppStore = create<ThemeSlice>()(
  persist(
    immer((...a) => ({
      ...createThemeSlice(...a)
    })),
    {
      name: 'okp4-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ theme: state.theme })
    }
  )
)
