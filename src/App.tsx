import type { FC } from 'react'
import React from 'react'
import { useAppStore } from './store/appStore'

const App: FC = () => {
  const theme = useAppStore(store => store.theme)
  const switchTheme = useAppStore(store => store.switchTheme)

  return (
    <div className={`theme--${theme}`}>
      <div className="okp4-dataverse-portal-main">
        <button onClick={switchTheme}>ClickMe</button>
      </div>
    </div>
  )
}

export default App
