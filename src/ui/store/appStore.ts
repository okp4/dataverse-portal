import type { StoreApi } from 'zustand/vanilla'
import { createStore } from 'zustand/vanilla'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import type { ThemeSlice } from './slice/theme.slice'
import { createThemeSlice } from './slice/theme.slice'
import type { SidebarSlice } from './slice/sidebar.slice'
import { createSidebarSlice } from './slice/sidebar.slice'
import type { ShareDataFormSlice } from './slice/shareDataForm.slice'
import { createShareDataFormSlice } from './slice/shareDataForm.slice'
import { isDevMode } from '@/util/env.util'

export const storeFactory = (): StoreApi<ThemeSlice & SidebarSlice & ShareDataFormSlice> =>
  createStore<ThemeSlice & SidebarSlice & ShareDataFormSlice>()(
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
