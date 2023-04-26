import type { FC } from 'react'
import classNames from 'classnames'
import { AppRouter } from '@/ui/component/router/appRouter'
import { Sidebar } from '@/ui/component/sidebar/sidebar'
import { useAppStore } from '@/ui/store/appStore'
import { Toolbar } from './component/toolbar/toolbar'
import { ErrorBoundary } from './component/errorBoundary/errorBoundary'
import { useLocation } from 'react-router-dom'

const App: FC = () => {
  const theme = useAppStore(store => store.theme)
  const isSidebarExpanded = useAppStore(store => store.isSidebarExpanded)
  const location = useLocation()

  return (
    <div className={`theme--${theme}`} style={{ height: 'inherit' }}>
      <div className="okp4-dataverse-portal-main-layout">
        <Sidebar />
        <div
          className={classNames('okp4-dataverse-portal-page-layout', {
            'expanded-sidebar': isSidebarExpanded
          })}
        >
          <div className="okp4-dataverse-portal-toolbar-wrapper">
            <Toolbar />
          </div>
          <div className="okp4-dataverse-portal-page-wrapper">
            <ErrorBoundary key={location.pathname}>
              <AppRouter />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
