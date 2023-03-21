import type { FC } from 'react'
import { createElement } from 'react'
import { ReactComponent as BurgerMenuLightIcon } from '@/asset/icon/burger-menu-light.svg'
import { ReactComponent as BurgerMenuDarkIcon } from '@/asset/icon/burger-menu-dark.svg'
import { ReactComponent as CloseLightIcon } from '@/asset/icon/close-light.svg'
import { ReactComponent as CloseDarkIcon } from '@/asset/icon/close-dark.svg'
import { ReactComponent as BuildAppsIcon } from '@/asset/icon/build-apps.svg'
import { ReactComponent as BuildAppsActiveIcon } from '@/asset/icon/build-apps-active.svg'
import { ReactComponent as CreateKnowledgeIcon } from '@/asset/icon/create-knowledge.svg'
import { ReactComponent as CreateKnowledgeActiveIcon } from '@/asset/icon/create-knowledge-active.svg'
import { ReactComponent as CreateDataspaceIcon } from '@/asset/icon/create-dataspace.svg'
import { ReactComponent as DataspaceCreatedLightIcon } from '@/asset/icon/dataspace-created-light.svg'
import { ReactComponent as DataspaceCreatedDarkIcon } from '@/asset/icon/dataspace-created-dark.svg'
import { ReactComponent as CreateDataspaceActiveIcon } from '@/asset/icon/create-dataspace-active.svg'
import { ReactComponent as CollapseIcon } from '@/asset/icon/collapse.svg'
import { ReactComponent as DatasetFolderLightIcon } from '@/asset/icon/dataset-folder-light.svg'
import { ReactComponent as DatasetFolderDarkIcon } from '@/asset/icon/dataset-folder-dark.svg'
import { ReactComponent as DiscordLightIcon } from '@/asset/icon/discord-light.svg'
import { ReactComponent as DiscordDarkIcon } from '@/asset/icon/discord-dark.svg'
import { ReactComponent as DocumentationIcon } from '@/asset/icon/documentation.svg'
import { ReactComponent as DocumentationActiveIcon } from '@/asset/icon/documentation-active.svg'
import { ReactComponent as ExpandIcon } from '@/asset/icon/expand.svg'
import { ReactComponent as ExploreIcon } from '@/asset/icon/explore.svg'
import { ReactComponent as ExploreActiveIcon } from '@/asset/icon/explore-active.svg'
import { ReactComponent as FeedbackIcon } from '@/asset/icon/feedback.svg'
import { ReactComponent as HelpIcon } from '@/asset/icon/help.svg'
import { ReactComponent as HelpActiveIcon } from '@/asset/icon/help-active.svg'
import { ReactComponent as HomeIcon } from '@/asset/icon/home.svg'
import { ReactComponent as HomeActiveIcon } from '@/asset/icon/home-active.svg'
import { ReactComponent as LinkedinLightIcon } from '@/asset/icon/linkedin-light.svg'
import { ReactComponent as LinkedinDarkIcon } from '@/asset/icon/linkedin-dark.svg'
import { ReactComponent as MediumLightIcon } from '@/asset/icon/medium-light.svg'
import { ReactComponent as MediumDarkIcon } from '@/asset/icon/medium-dark.svg'
import { ReactComponent as MoonIcon } from '@/asset/icon/moon.svg'
import { ReactComponent as ServiceFolderLightIcon } from '@/asset/icon/service-folder-light.svg'
import { ReactComponent as ServiceFolderDarkIcon } from '@/asset/icon/service-folder-dark.svg'
import { ReactComponent as ShareIcon } from '@/asset/icon/share.svg'
import { ReactComponent as ShareActiveIcon } from '@/asset/icon/share-active.svg'
import { ReactComponent as SunIcon } from '@/asset/icon/sun.svg'
import { ReactComponent as TwitterLightIcon } from '@/asset/icon/twitter-light.svg'
import { ReactComponent as TwitterDarkIcon } from '@/asset/icon/twitter-dark.svg'
import { ReactComponent as WalletIcon } from '@/asset/icon/wallet.svg'
import { ReactComponent as ArrowRightIcon } from '@/asset/icon/arrow-right.svg'
import { ReactComponent as AllLightIcon } from '@/asset/icon/all-light.svg'
import { ReactComponent as AllDarkIcon } from '@/asset/icon/all-dark.svg'

export type IconName =
  | 'all-light'
  | 'all-dark'
  | 'collapse'
  | 'arrow-right'
  | 'expand'
  | 'documentation'
  | 'build-apps'
  | 'create-knowledge'
  | 'create-dataspace'
  | 'explore'
  | 'feedback'
  | 'help'
  | 'moon'
  | 'share'
  | 'sun'
  | 'home'
  | 'linkedin-light'
  | 'linkedin-dark'
  | 'discord-dark'
  | 'discord-light'
  | 'twitter-light'
  | 'twitter-dark'
  | 'medium-light'
  | 'medium-dark'
  | 'build-apps-active'
  | 'create-knowledge-active'
  | 'create-dataspace-active'
  | 'explore-active'
  | 'documentation-active'
  | 'help-active'
  | 'share-active'
  | 'home-active'
  | 'wallet'
  | 'dataset-folder-light'
  | 'dataset-folder-dark'
  | 'service-folder-light'
  | 'service-folder-dark'
  | 'dataspace-created-light'
  | 'dataspace-created-dark'
  | 'burger-menu-light'
  | 'burger-menu-dark'
  | 'close-light'
  | 'close-dark'

const icons: Record<IconName, React.FunctionComponent> = {
  collapse: CollapseIcon,
  'arrow-right': ArrowRightIcon,
  expand: ExpandIcon,
  documentation: DocumentationIcon,
  'build-apps': BuildAppsIcon,
  'create-knowledge': CreateKnowledgeIcon,
  'create-dataspace': CreateDataspaceIcon,
  explore: ExploreIcon,
  feedback: FeedbackIcon,
  help: HelpIcon,
  moon: MoonIcon,
  share: ShareIcon,
  sun: SunIcon,
  home: HomeIcon,
  'linkedin-light': LinkedinLightIcon,
  'linkedin-dark': LinkedinDarkIcon,
  'discord-dark': DiscordDarkIcon,
  'discord-light': DiscordLightIcon,
  'twitter-light': TwitterLightIcon,
  'twitter-dark': TwitterDarkIcon,
  'medium-light': MediumLightIcon,
  'medium-dark': MediumDarkIcon,
  'build-apps-active': BuildAppsActiveIcon,
  'create-knowledge-active': CreateKnowledgeActiveIcon,
  'create-dataspace-active': CreateDataspaceActiveIcon,
  'explore-active': ExploreActiveIcon,
  'documentation-active': DocumentationActiveIcon,
  'help-active': HelpActiveIcon,
  'share-active': ShareActiveIcon,
  'home-active': HomeActiveIcon,
  wallet: WalletIcon,
  'dataset-folder-dark': DatasetFolderDarkIcon,
  'dataset-folder-light': DatasetFolderLightIcon,
  'service-folder-dark': ServiceFolderDarkIcon,
  'service-folder-light': ServiceFolderLightIcon,
  'dataspace-created-dark': DataspaceCreatedDarkIcon,
  'dataspace-created-light': DataspaceCreatedLightIcon,
  'burger-menu-light': BurgerMenuLightIcon,
  'burger-menu-dark': BurgerMenuDarkIcon,
  'close-light': CloseLightIcon,
  'close-dark': CloseDarkIcon,
  'all-light': AllLightIcon,
  'all-dark': AllDarkIcon
}

type IconProps = {
  name: IconName
}

export const Icon: FC<IconProps> = ({ name }) => createElement(icons[name])
