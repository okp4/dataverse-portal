import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { ThemeSlice } from './slice/theme.slice'
import { createThemeSlice } from './slice/theme.slice'
import type { SidebarSlice } from './slice/sidebar.slice'
import { createSidebarSlice } from './slice/sidebar.slice'

export const useAppStore = create<ThemeSlice & SidebarSlice>()(
  persist(
    immer((...a) => ({
      ...createThemeSlice(...a),
      ...createSidebarSlice(...a)
    })),
    {
      name: 'okp4-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ theme: state.theme, isSidebarExpanded: state.isSidebarExpanded })
    }
  )
)
