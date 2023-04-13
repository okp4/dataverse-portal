import type { FC } from 'react'
import classNames from 'classnames'
import { AppRouter } from '@/ui/component/router/appRouter'
import { Sidebar } from '@/ui/component/sidebar/sidebar'
import { useAppStore } from '@/ui/store/appStore'
import { Toolbar } from './component/toolbar/toolbar'
// import { ErrorBoundary } from 'react-error-boundary'
// import { NotFoundError } from './page/error/notFound/notFoundError'

const App: FC = () => {
  const theme = useAppStore(store => store.theme)
  const isSidebarExpanded = useAppStore(store => store.isSidebarExpanded)

  return (
    <div className={`theme--${theme}`} style={{ height: 'inherit' }}>
      {/* <ErrorBoundary FallbackComponent={NotFoundError}> */}
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
            <AppRouter />
          </div>
        </div>
      </div>
      {/* </ErrorBoundary> */}
    </div>
  )
}

export default App
