import type { FC } from 'react'
import classNames from 'classnames'
import { AppRouter } from '@/ui/component/router/appRouter'
import { Sidebar } from '@/ui/component/sidebar/sidebar'
import { useAppStore } from '@/ui/store/appStore'
import { Toolbar } from './component/toolbar/toolbar'
import { ErrorBoundary } from './component/errorBoundary/errorBoundary'

const App: FC = () => {
  const theme = useAppStore(store => store.theme)
  const isSidebarExpanded = useAppStore(store => store.isSidebarExpanded)

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
            <ErrorBoundary>
              <AppRouter />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
