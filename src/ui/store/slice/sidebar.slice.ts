import type { StateCreator } from 'zustand'

export type SidebarSlice = {
  isSidebarExpanded: boolean
  expandSidebar: () => void
  collapseSidebar: () => void
  toggleSidebar: () => void
}

export const createSidebarSlice: StateCreator<SidebarSlice, [], [], SidebarSlice> = set => ({
  isSidebarExpanded: true,
  expandSidebar: (): void =>
    set(() => ({
      isSidebarExpanded: true
    })),
  collapseSidebar: (): void => set(() => ({ isSidebarExpanded: false })),
  toggleSidebar: (): void =>
    set(state => ({
      isSidebarExpanded: !state.isSidebarExpanded
    }))
})
