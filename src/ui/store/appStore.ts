import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import type { ThemeSlice } from './slice/theme.slice'
import { createThemeSlice } from './slice/theme.slice'
import type { SidebarSlice } from './slice/sidebar.slice'
import { createSidebarSlice } from './slice/sidebar.slice'
import type { ShareDataFormSlice } from './slice/shareDataForm.slice'
import { createShareDataFormSlice } from './slice/shareDataForm.slice'
import { isDevMode } from '@/util/env.util'

export const useAppStore = create<ThemeSlice & SidebarSlice & ShareDataFormSlice>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createThemeSlice(...a),
        ...createSidebarSlice(...a),
        ...createShareDataFormSlice(...a)
      })),
      {
        name: 'okp4-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: state => ({ theme: state.theme, isSidebarExpanded: state.isSidebarExpanded })
      }
    ),
    {
      anonymousActionType: 'Store',
      name: 'appStore',
      enabled: isDevMode()
    }
  )
)
