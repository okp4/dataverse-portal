import { Home } from '@/page/home/home'
import Dataverse from '@/page/dataverse/dataverse'
import Dataspace from '@/page/dataverse/dataspace/dataspace'
import Dataset from '@/page/dataverse/dataset/dataset'
import Service from '@/page/dataverse/service/service'

export enum routes {
  home = '/',
  dataverse = 'dataverse',
  dataspace = 'dataverse/dataspace/:id',
  dataset = 'dataverse/dataset/:id',
  service = 'dataverse/service/:id'
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
  },
  {
    id: 'dataspace',
    path: routes.dataspace,
    element: <Dataspace />
  },
  {
    id: 'dataset',
    path: routes.dataset,
    element: <Dataset />
  },
  {
    id: 'service',
    path: routes.service,
    element: <Service />
  }
]
