import type { FC } from 'react'
import React, { useCallback } from 'react'
import { useAppStore } from './store/appStore'

const App: FC = () => {
  const theme = useAppStore(store => store.theme)
  const setTheme = useAppStore(store => store.setTheme)
  const handleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [setTheme, theme])
  return (
    <div className={`theme--${theme}`}>
      <div className="okp4-dataverse-portal-main">
        <button onClick={handleTheme}>ClickMe</button>
      </div>
    </div>
  )
}

export default App
