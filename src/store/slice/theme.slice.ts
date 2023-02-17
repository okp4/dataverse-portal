import type { StateCreator } from 'zustand'

export type Theme = 'light' | 'dark'

export type ThemeSlice = {
  theme: Theme
  setTheme: (newTheme: Theme) => void
}

export const createThemeSlice: StateCreator<ThemeSlice, [], [], ThemeSlice> = set => ({
  theme: 'light',
  setTheme: (newTheme): void =>
    set(() => ({
      theme: newTheme
    }))
})
