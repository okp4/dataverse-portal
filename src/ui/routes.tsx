import { Home } from '@/ui/page/home/home'
import Dataverse from '@/ui/page/dataverse/dataverse'
import Dataspace from '@/ui/page/dataverse/dataspace/dataspace'
import Dataset from '@/ui/page/dataverse/dataset/dataset'
import Service from '@/ui/page/dataverse/service/service'
import { Governance } from '@/ui/page/dataverse/dataspace/governance/governance'
import { NotFoundError } from '@/ui/page/error/notFoundError/notFoundError'
import { Share } from '@/ui/page/share/share'
import { ShareDataset } from '@/ui/page/share/dataset/shareDataset'

export enum routes {
  home = '/',
  dataverse = 'dataverse',
  zone = 'dataverse/zone/:id',
  dataset = 'dataverse/dataset/:id',
  service = 'dataverse/service/:id',
  governance = 'dataverse/zone/:id/governance/:sectionId?/:subsectionId?',
  share = 'share',
  shareDataset = '/share/data',
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
    id: 'zone',
    path: routes.zone,
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
  },
  {
    id: 'share',
    path: routes.share,
    element: <Share />
  },
  {
    id: 'shareDataset',
    path: routes.shareDataset,
    element: <ShareDataset />
  }
]
