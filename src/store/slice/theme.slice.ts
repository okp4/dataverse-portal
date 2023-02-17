import type { StateCreator } from 'zustand'

export type Theme = 'light' | 'dark'

export type ThemeSlice = {
  theme: Theme
  switchTheme: () => void
}

export const createThemeSlice: StateCreator<ThemeSlice, [], [], ThemeSlice> = set => ({
  theme: 'light',
  switchTheme: (): void =>
    set(state => ({
      theme: state.theme === 'light' ? 'dark' : 'light'
    }))
})
