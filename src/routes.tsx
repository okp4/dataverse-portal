import { WorkInProgress } from '@/page/workInProgress/workInProgress'
import { Home } from '@/page/home/home'

export enum routes {
  home = '/',
  catalog = '/catalog',
  sharing = '/sharing',
  knowledgeBuilder = '/knowledge-builder',
  dataspaceBuilder = '/dataspace-builder',
  appBuilder = '/app-builder',
  documentation = '/documentation',
  help = '/help'
}

export type Route = {
  id: string
  path: string
  element: React.ReactNode
}

export const appRoutes: Route[] = [
  {
    id: 'home',
    path: routes.home,
    element: <Home />
  },
  {
    id: 'catalog',
    path: routes.catalog,
    element: <WorkInProgress />
  },
  {
    id: 'sharing',
    path: routes.sharing,
    element: <WorkInProgress />
  },
  {
    id: 'knowledgeBuilder',
    path: routes.knowledgeBuilder,
    element: <WorkInProgress />
  },
  {
    id: 'dataspaceBuilder',
    path: routes.dataspaceBuilder,
    element: <WorkInProgress />
  },
  {
    id: 'appBuilder',
    path: routes.appBuilder,
    element: <WorkInProgress />
  },
  {
    id: 'documentation',
    path: routes.documentation,
    element: <WorkInProgress />
  },
  {
    id: 'help',
    path: routes.help,
    element: <WorkInProgress />
  }
]
