import type { FC } from 'react'
import classnames from 'classnames'
import { Button } from '@/component/button/button'
import { Okp4Logo } from '@/component/logo/okp4Logo'
import { Switch } from '@/component/switch/switch'
import { useAppStore } from '@/store/appStore'
import type { IconName } from '@/component/icon/icon'
import { Icon } from '@/component/icon/icon'
import './sidebar.scss'
import { Navigation } from './navigation/navigation'

type SocialMedia = {
  id: string
  href: string
}

const socialMedias: SocialMedia[] = [
  {
    id: 'twitter',
    href: 'https://twitter.com/OKP4_Protocol'
  },
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/company/okp4-open-knowledge-platform-for/'
  },
  {
    id: 'discord',
    href: 'https://discord.com/invite/okp4'
  },
  {
    id: 'medium',
    href: 'https://blog.okp4.network'
  }
]

// eslint-disable-next-line max-lines-per-function
export const Sidebar: FC = () => {
  const theme = useAppStore(store => store.theme)
  const isSidebarExpanded = useAppStore(store => store.isSidebarExpanded)
  const collapseSidebar = useAppStore(store => store.collapseSidebar)
  const expandSidebar = useAppStore(store => store.expandSidebar)
  const switchTheme = useAppStore(store => store.switchTheme)

  return (
    <div
      className={classnames('okp4-dataverse-portal-sidebar-main', {
        collapsed: !isSidebarExpanded
      })}
    >
      <div
        className="okp4-dataverse-portal-sidebar-collapse-container"
        onClick={isSidebarExpanded ? collapseSidebar : expandSidebar}
      >
        {isSidebarExpanded ? <Icon name="collapse" /> : <Icon name="expand" />}
      </div>
      <div
        className={classnames('okp4-dataverse-portal-sidebar-title-container', {
          collapsed: !isSidebarExpanded
        })}
      >
        <Okp4Logo logoOnly={!isSidebarExpanded} />
        <Switch
          icons={{
            checked: <Icon name="sun" />,
            notChecked: <Icon name="moon" />
          }}
          isChecked={theme === 'light'}
          onCheckedChange={switchTheme}
        />
      </div>
      <Navigation />
      <div
        className={classnames('okp4-dataverse-portal-sidebar-footer-container', {
          collapsed: !isSidebarExpanded
        })}
      >
        {isSidebarExpanded && (
          <Button icons={{ startIcon: <Icon name="feedback" /> }} label="give us feedback" />
        )}
        <div
          className={classnames('okp4-dataverse-portal-sidebar-footer-social-medias-container', {
            collapsed: !isSidebarExpanded
          })}
        >
          {socialMedias.map(({ id, href }) => (
            <a href={href} key={id} rel="noreferrer" target="_blank">
              <Icon name={`${id}-${theme}` as IconName} />
            </a>
          ))}
        </div>
        {isSidebarExpanded && (
          <a href="https://www.okp4.network" rel="noreferrer" target="_blank">
            <p className="text">About OKP4</p>
          </a>
        )}
      </div>
    </div>
  )
}
