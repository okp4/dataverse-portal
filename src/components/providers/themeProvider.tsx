'use client'
import type { FC } from 'react'
import { useState, useEffect } from 'react'
import type { Theme } from '@/context/themeContext'
import ThemeContext from '@/context/themeContext'
import type { LocalStorageState } from '@/hooks/useLocalStorage'
import { useLocalStorage } from '@/hooks/useLocalStorage'

type ThemeProviderProps = Readonly<{
  children: React.ReactNode
}>

const ThemeProvider: FC<ThemeProviderProps> = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>('light')
  const [value]: LocalStorageState = useLocalStorage('okp4-theme')

  useEffect(() => {
    if (!value) {
      return
    }
    setTheme(value as Theme)
  }, [setTheme, value])
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`theme--${theme}`}>{children}</div>
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
