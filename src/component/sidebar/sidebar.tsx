import type { FC } from 'react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { Button } from '@/component/button/button'
import { Okp4Logo } from '@/component/logo/okp4Logo'
import { Switch } from '@/component/switch/switch'
import { useAppStore } from '@/store/appStore'
import type { IconName } from '@/component/icon/icon'
import { Icon } from '@/component/icon/icon'
import { Navigation } from './navigation/navigation'
import './sidebar.scss'
import './i18n/index'

// eslint-disable-next-line max-lines-per-function
export const Sidebar: FC = () => {
  const { t } = useTranslation('sidebar')
  const theme = useAppStore(store => store.theme)
  const isSidebarExpanded = useAppStore(store => store.isSidebarExpanded)
  const collapseSidebar = useAppStore(store => store.collapseSidebar)
  const expandSidebar = useAppStore(store => store.expandSidebar)
  const switchTheme = useAppStore(store => store.switchTheme)

  const handleFeedbackClick = useCallback(() => {
    window.open('https://okp4.typeform.com/to/TNyFBH72', '_blank')
  }, [])

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
          <Button
            icons={{ startIcon: <Icon name="feedback" /> }}
            label={t('sidebar.footer.feedback')}
            onClick={handleFeedbackClick}
          />
        )}
        <div
          className={classnames('okp4-dataverse-portal-sidebar-footer-social-medias-container', {
            collapsed: !isSidebarExpanded
          })}
        >
          {['twitter', 'linkedin', 'discord', 'medium'].map(id => (
            <a
              href={APP_ENV.urls[`social:${id}` as keyof typeof APP_ENV.urls]}
              key={id}
              rel="noreferrer"
              target="_blank"
            >
              <Icon name={`${id}-${theme}` as IconName} />
            </a>
          ))}
        </div>
        {isSidebarExpanded && (
          <a href="https://www.okp4.network" rel="noreferrer" target="_blank">
            <p className="text">{t('sidebar.footer.about')}</p>
          </a>
        )}
      </div>
    </div>
  )
}
