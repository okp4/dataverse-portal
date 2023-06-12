import type { FC } from 'react'
import { createElement } from 'react'
import { ReactComponent as BurgerMenuLightIcon } from '@/ui/asset/icon/burger-menu-light.svg'
import { ReactComponent as BurgerMenuDarkIcon } from '@/ui/asset/icon/burger-menu-dark.svg'
import { ReactComponent as CloseLightIcon } from '@/ui/asset/icon/close-light.svg'
import { ReactComponent as CloseDarkIcon } from '@/ui/asset/icon/close-dark.svg'
import { ReactComponent as BuildAppsIcon } from '@/ui/asset/icon/build-apps.svg'
import { ReactComponent as BuildAppsActiveIcon } from '@/ui/asset/icon/build-apps-active.svg'
import { ReactComponent as CreateKnowledgeIcon } from '@/ui/asset/icon/create-knowledge.svg'
import { ReactComponent as CreateKnowledgeActiveIcon } from '@/ui/asset/icon/create-knowledge-active.svg'
import { ReactComponent as CreateDataspaceIcon } from '@/ui/asset/icon/create-dataspace.svg'
import { ReactComponent as DataspaceCreatedLightIcon } from '@/ui/asset/icon/dataspace-created-light.svg'
import { ReactComponent as DataspaceCreatedDarkIcon } from '@/ui/asset/icon/dataspace-created-dark.svg'
import { ReactComponent as CreateDataspaceActiveIcon } from '@/ui/asset/icon/create-dataspace-active.svg'
import { ReactComponent as DatasetFolderLightIcon } from '@/ui/asset/icon/dataset-folder-light.svg'
import { ReactComponent as DatasetFolderDarkIcon } from '@/ui/asset/icon/dataset-folder-dark.svg'
import { ReactComponent as DiscordLightIcon } from '@/ui/asset/icon/discord-light.svg'
import { ReactComponent as DiscordDarkIcon } from '@/ui/asset/icon/discord-dark.svg'
import { ReactComponent as DocumentationIcon } from '@/ui/asset/icon/documentation.svg'
import { ReactComponent as DocumentationActiveIcon } from '@/ui/asset/icon/documentation-active.svg'
import { ReactComponent as ExploreIcon } from '@/ui/asset/icon/explore.svg'
import { ReactComponent as ExploreActiveIcon } from '@/ui/asset/icon/explore-active.svg'
import { ReactComponent as FeedbackIcon } from '@/ui/asset/icon/feedback.svg'
import { ReactComponent as HelpIcon } from '@/ui/asset/icon/help.svg'
import { ReactComponent as HelpActiveIcon } from '@/ui/asset/icon/help-active.svg'
import { ReactComponent as HomeIcon } from '@/ui/asset/icon/home.svg'
import { ReactComponent as HomeActiveIcon } from '@/ui/asset/icon/home-active.svg'
import { ReactComponent as LinkedinLightIcon } from '@/ui/asset/icon/linkedin-light.svg'
import { ReactComponent as LinkedinDarkIcon } from '@/ui/asset/icon/linkedin-dark.svg'
import { ReactComponent as MediumLightIcon } from '@/ui/asset/icon/medium-light.svg'
import { ReactComponent as MediumDarkIcon } from '@/ui/asset/icon/medium-dark.svg'
import { ReactComponent as MoonIcon } from '@/ui/asset/icon/moon.svg'
import { ReactComponent as ServiceFolderLightIcon } from '@/ui/asset/icon/service-folder-light.svg'
import { ReactComponent as ServiceFolderDarkIcon } from '@/ui/asset/icon/service-folder-dark.svg'
import { ReactComponent as ShareIcon } from '@/ui/asset/icon/share.svg'
import { ReactComponent as ShareActiveIcon } from '@/ui/asset/icon/share-active.svg'
import { ReactComponent as SunIcon } from '@/ui/asset/icon/sun.svg'
import { ReactComponent as TwitterLightIcon } from '@/ui/asset/icon/twitter-light.svg'
import { ReactComponent as TwitterDarkIcon } from '@/ui/asset/icon/twitter-dark.svg'
import { ReactComponent as WalletIcon } from '@/ui/asset/icon/wallet.svg'
import { ReactComponent as ArrowRightIcon } from '@/ui/asset/icon/arrow-right.svg'
import { ReactComponent as AllLightIcon } from '@/ui/asset/icon/all-light.svg'
import { ReactComponent as AllDarkIcon } from '@/ui/asset/icon/all-dark.svg'
import { ReactComponent as ArrowLeftIcon } from '@/ui/asset/icon/arrow-left.svg'
import { ReactComponent as FileIcon } from '@/ui/asset/icon/file.svg'
import { ReactComponent as FolderIcon } from '@/ui/asset/icon/folder.svg'
import { ReactComponent as CalendarIcon } from '@/ui/asset/icon/calendar.svg'
import { ReactComponent as EarthIcon } from '@/ui/asset/icon/earth.svg'
import { ReactComponent as EarthLightIcon } from '@/ui/asset/icon/earth-light.svg'
import { ReactComponent as EarthDarkIcon } from '@/ui/asset/icon/earth-dark.svg'
import { ReactComponent as ShieldIcon } from '@/ui/asset/icon/shield.svg'
import { ReactComponent as ShieldLightIcon } from '@/ui/asset/icon/shield-light.svg'
import { ReactComponent as ShieldDarkIcon } from '@/ui/asset/icon/shield-dark.svg'
import { ReactComponent as CopyLight } from '@/ui/asset/icon/copy-light.svg'
import { ReactComponent as CopyDark } from '@/ui/asset/icon/copy-dark.svg'
import { ReactComponent as ErrorIcon } from '@/ui/asset/icon/error.svg'
import { ReactComponent as WarningIcon } from '@/ui/asset/icon/warning.svg'
import { ReactComponent as InfoLightIcon } from '@/ui/asset/icon/info-light.svg'
import { ReactComponent as InfoDarkIcon } from '@/ui/asset/icon/info-dark.svg'
import { ReactComponent as CheckIcon } from '@/ui/asset/icon/check.svg'
import { ReactComponent as HookDarkIcon } from '@/ui/asset/icon/hook-dark.svg'
import { ReactComponent as HookLightIcon } from '@/ui/asset/icon/hook-light.svg'
import { ReactComponent as ComputerDarkIcon } from '@/ui/asset/icon/computer-dark.svg'
import { ReactComponent as ComputerLigtIcon } from '@/ui/asset/icon/computer-light.svg'
import { ReactComponent as DescriptionDarkIcon } from '@/ui/asset/icon/description-dark.svg'
import { ReactComponent as DescriptionLightIcon } from '@/ui/asset/icon/description-light.svg'
import { ReactComponent as ShapesDarkIcon } from '@/ui/asset/icon/shapes-dark.svg'
import { ReactComponent as ShapesLightIcon } from '@/ui/asset/icon/shapes-light.svg'
import { ReactComponent as UserDarkIcon } from '@/ui/asset/icon/user-dark.svg'
import { ReactComponent as UserLightIcon } from '@/ui/asset/icon/user-light.svg'
import { ReactComponent as UsersDarkIcon } from '@/ui/asset/icon/users-dark.svg'
import { ReactComponent as UsersLightIcon } from '@/ui/asset/icon/users-light.svg'
import { ReactComponent as KeyDarkIcon } from '@/ui/asset/icon/key-dark.svg'
import { ReactComponent as KeyLightIcon } from '@/ui/asset/icon/key-light.svg'
import { ReactComponent as LogOutIcon } from '@/ui/asset/icon/log-out.svg'
import { ReactComponent as ChevronIcon } from '@/ui/asset/icon/chevron.svg'
import { ReactComponent as ChevronSharpIcon } from '@/ui/asset/icon/chevron-sharp.svg'
import { ReactComponent as KeplerIcon } from '@/ui/asset/icon/keplr.svg'
import { ReactComponent as MagnifierIcon } from '@/ui/asset/icon/magnifier.svg'
import { ReactComponent as CheckboxIcon } from '@/ui/asset/icon/checkbox.svg'
import { ReactComponent as LargeMagnifierWithCrossIcon } from '@/ui/asset/icon/large-magnifier-with-cross.svg'

export type IconName =
  | 'all-light'
  | 'all-dark'
  | 'arrow-left'
  | 'arrow-right'
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
  | 'file'
  | 'folder'
  | 'calendar'
  | 'earth'
  | 'earth-light'
  | 'earth-dark'
  | 'shield'
  | 'shield-light'
  | 'shield-dark'
  | 'copy-light'
  | 'copy-dark'
  | 'error'
  | 'warning'
  | 'check'
  | 'info-light'
  | 'info-dark'
  | 'hook-light'
  | 'hook-dark'
  | 'computer-dark'
  | 'computer-light'
  | 'description-dark'
  | 'description-light'
  | 'shapes-dark'
  | 'shapes-light'
  | 'user-dark'
  | 'user-light'
  | 'users-dark'
  | 'users-light'
  | 'key-dark'
  | 'key-light'
  | 'log-out'
  | 'chevron'
  | 'chevron-sharp'
  | 'keplr'
  | 'magnifier'
  | 'checkbox'
  | 'large-magnifier-with-cross'

const icons: Record<IconName, React.FunctionComponent> = {
  'arrow-right': ArrowRightIcon,
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
  'all-dark': AllDarkIcon,
  'arrow-left': ArrowLeftIcon,
  file: FileIcon,
  folder: FolderIcon,
  calendar: CalendarIcon,
  earth: EarthIcon,
  'earth-light': EarthLightIcon,
  'earth-dark': EarthDarkIcon,
  shield: ShieldIcon,
  'shield-dark': ShieldDarkIcon,
  'shield-light': ShieldLightIcon,
  'copy-light': CopyLight,
  'copy-dark': CopyDark,
  warning: WarningIcon,
  error: ErrorIcon,
  check: CheckIcon,
  'info-light': InfoLightIcon,
  'info-dark': InfoDarkIcon,
  'hook-light': HookLightIcon,
  'hook-dark': HookDarkIcon,
  'computer-dark': ComputerDarkIcon,
  'computer-light': ComputerLigtIcon,
  'description-dark': DescriptionDarkIcon,
  'description-light': DescriptionLightIcon,
  'shapes-dark': ShapesDarkIcon,
  'shapes-light': ShapesLightIcon,
  'user-dark': UserDarkIcon,
  'user-light': UserLightIcon,
  'users-dark': UsersDarkIcon,
  'users-light': UsersLightIcon,
  'key-dark': KeyDarkIcon,
  'key-light': KeyLightIcon,
  'log-out': LogOutIcon,
  chevron: ChevronIcon,
  'chevron-sharp': ChevronSharpIcon,
  keplr: KeplerIcon,
  magnifier: MagnifierIcon,
  checkbox: CheckboxIcon,
  'large-magnifier-with-cross': LargeMagnifierWithCrossIcon
}

type IconProps = {
  name: IconName
}

export const Icon: FC<IconProps> = ({ name }) => createElement(icons[name])
