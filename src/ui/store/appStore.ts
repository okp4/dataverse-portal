import type { StoreApi } from 'zustand/vanilla'
import { createStore } from 'zustand/vanilla'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import type { ThemeSlice } from './slice/theme.slice'
import { createThemeSlice } from './slice/theme.slice'
import type { SidebarSlice } from './slice/sidebar.slice'
import { createSidebarSlice } from './slice/sidebar.slice'
import type { ShareDataSlice } from './slice/shareData/shareData.slice'
import { createShareDataSlice } from './slice/shareData/shareData.slice'
import { isDevMode } from '@/util/env.util'

export const storeFactory = (): StoreApi<ThemeSlice & SidebarSlice & ShareDataSlice> =>
  createStore<ThemeSlice & SidebarSlice & ShareDataSlice>()(
    devtools(
      persist(
        immer((...a) => ({
          ...createThemeSlice(...a),
          ...createSidebarSlice(...a),
          ...createShareDataSlice(...a)
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
