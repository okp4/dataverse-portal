'use client'

import type { FC } from 'react'
import { useState } from 'react'
import type { Theme } from '@/context/themeContext'
import ThemeContext from '@/context/themeContext'

type ThemeProviderProps = Readonly<{
  children: React.ReactNode
}>

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>('light')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`theme--${theme}`}>{children}</div>
    </ThemeContext.Provider>
  )
}
