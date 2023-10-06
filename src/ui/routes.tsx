import { Home } from '@/ui/page/home/home'
import Dataverse from '@/ui/page/dataverse/dataverse'
import Zone from '@/ui/page/dataverse/zone/zone'
import Dataset from '@/ui/page/dataverse/dataset/dataset'
import Service from '@/ui/page/dataverse/service/service'
import { Governance } from '@/ui/page/dataverse/zone/governance/governance'
import { NotFoundError } from '@/ui/page/error/notFoundError/notFoundError'
import { Share } from '@/ui/page/share/share'
import { ShareDataset } from '@/ui/page/share/dataset/shareDataset'
import { ShareService } from '@/ui/page/share/service/shareService'
import { UnsupportedFeatureLayout } from '@/ui//view/unsupportedFeatureLayout/unsupportedFeatureLayout'

export enum routes {
  home = '/',
  dataverse = 'dataverse',
  zone = 'dataverse/zone/:id',
  dataset = 'dataverse/dataset/:id',
  service = 'dataverse/service/:id',
  governance = 'dataverse/zone/:id/governance/:sectionId?/:subsectionId?',
  share = 'share',
  shareDataset = '/share/data',
  shareService = '/share/service',
  notFoundError = '*'
}

export type Route = {
  id: string
  path: string
  element: React.ReactNode
  layout?: React.ReactNode
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
    element: <Zone />
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
    element: <Share />,
    layout: <UnsupportedFeatureLayout />
  },
  {
    id: 'shareDataset',
    path: routes.shareDataset,
    element: <ShareDataset />,
    layout: <UnsupportedFeatureLayout />
  },
  {
    id: 'shareService',
    path: routes.shareService,
    element: <ShareService />,
    layout: <UnsupportedFeatureLayout />
  }
]
