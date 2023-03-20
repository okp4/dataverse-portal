import { Home } from '@/page/home/home'
import Dataverse from '@/page/dataverse/dataverse'

export enum routes {
  home = '/',
  dataverse = '/dataverse'
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
    id: 'dataverse',
    path: routes.dataverse,
    element: <Dataverse />
  }
]
