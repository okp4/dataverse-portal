import { Route } from 'react-router-dom'
import { Home } from '@/ui/page/home/home'
import Dataverse from '@/ui/page/dataverse/dataverse'
import Dataspace from '@/ui/page/dataverse/dataspace/dataspace'
import Dataset from '@/ui/page/dataverse/dataset/dataset'
import Service from '@/ui/page/dataverse/service/service'
import { Governance, Section } from '@/ui/page/dataverse/dataspace/governance/governance'

export enum routes {
  home = '/',
  dataverse = 'dataverse',
  dataspace = 'dataverse/dataspace/:id',
  dataset = 'dataverse/dataset/:id',
  service = 'dataverse/service/:id',
  governance = 'dataverse/dataspace/:id/governance',
  notFoundError = '*'
}

export type Route = {
  id: string
  path: string
  element: React.ReactNode
  nestedRoute?: React.ReactNode
}

export const appRoutes: Route[] = [
  {
    id: 'notFoundError',
    path: routes.notFoundError,
    // TODO: replace with 404 page component
    element: <div>404</div>
  },
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
    id: 'governance',
    path: routes.governance,
    element: <Governance />,
    nestedRoute: (
      <Route element={<Section />} path=":sectionId">
        <Route element={<Section />} path=":subsectionId" />
      </Route>
    )
  }
]
