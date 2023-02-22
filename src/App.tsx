import type { FC } from 'react'
import { AppRouter } from '@/component/router/appRouter'
import { Sidebar } from '@/component/sidebar/sidebar'
import { useAppStore } from '@/store/appStore'
import { Toolbar } from './component/toolbar/toolbar'

const App: FC = () => {
  const theme = useAppStore(store => store.theme)

  return (
    <div className={`theme--${theme}`} style={{ minHeight: 'inherit' }}>
      <div className="okp4-dataverse-portal-main-layout">
        <Sidebar />
        <div className="okp4-dataverse-portal-page-layout">
          <Toolbar />
          <AppRouter />
        </div>
      </div>
    </div>
  )
}

export default App
