import { Home } from '@/ui/page/home/home'
import Dataverse from '@/ui/page/dataverse/dataverse'
import Dataspace from '@/ui/page/dataverse/dataspace/dataspace'
import Dataset from '@/ui/page/dataverse/dataset/dataset'
import Service from '@/ui/page/dataverse/service/service'
import { Governance } from '@/ui/page/dataverse/dataspace/governance/governance'
import { NotFoundError } from '@/ui/page/notFoundError/notFoundError'

export enum routes {
  home = '/',
  dataverse = 'dataverse',
  dataspace = 'dataverse/dataspace/:id',
  dataset = 'dataverse/dataset/:id',
  service = 'dataverse/service/:id',
  governance = 'dataverse/dataspace/:id/governance/:sectionId?/:subsectionId?',
  notFoundError = '*'
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
  },
  {
    id: 'notFoundError',
    path: routes.notFoundError,
    element: <NotFoundError />
  },
  {
    id: 'governance',
    path: routes.governance,
    element: <Governance />
  }
]
