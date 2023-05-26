import type { FC } from 'react'
import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { Button } from '@/ui/component/button/button'
import { Okp4Logo } from '@/ui/component/logo/okp4Logo'
import { Switch } from '@/ui/component/switch/switch'
import { useAppStore } from '@/ui/store/appStore'
import type { IconName } from '@/ui/component/icon/icon'
import { Icon } from '@/ui/component/icon/icon'
import { useBreakpoint } from '@/ui/hook/useBreakpoint'
import { Navigation } from './navigation/navigation'
import { LanguageSwitcher } from './languageSwitcher/languageSwitcher'
import './sidebar.scss'
import './i18n/index'

// eslint-disable-next-line max-lines-per-function
export const Sidebar: FC = () => {
  const { t } = useTranslation('sidebar')
  const { isSidebarExpanded, switchTheme, toggleSidebar, theme } = useAppStore(
    state => ({
      toggleSidebar: state.toggleSidebar,
      isSidebarExpanded: state.isSidebarExpanded,
      switchTheme: state.switchTheme,
      theme: state.theme
    }),
    shallow
  )
  const { isMobile, isTablet } = useBreakpoint()
  const isMobileSidebarOpen = (isMobile || isTablet) && isSidebarExpanded

  const handleFeedbackClick = useCallback(() => {
    window.open(APP_ENV.urls['form:feedback'], '_blank')
  }, [])

  return (
    <div className="okp4-dataverse-portal-sidebar-main">
      <div
        className={classnames('okp4-dataverse-portal-sidebar-container', {
          collapsed: !isSidebarExpanded
        })}
      >
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
          {isMobileSidebarOpen && (
            <div className="okp4-dataverse-portal-sidebar-close-icon" onClick={toggleSidebar}>
              <Icon name={`close-${theme}`} />
            </div>
          )}
        </div>
        <Navigation />
        <div
          className={classnames('okp4-dataverse-portal-sidebar-footer-container', {
            collapsed: !isSidebarExpanded
          })}
        >
          {isSidebarExpanded && (
            <>
              <p className="okp4-dataverse-portal-sidebar-footer-version text">Alpha Version</p>
              <Button
                icons={{ startIcon: <Icon name="feedback" /> }}
                label={t('sidebar.footer.feedback')}
                onClick={handleFeedbackClick}
                variant="outlined-tertiary"
              />
            </>
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
            <a href={APP_ENV.urls['about:okp4']} rel="noreferrer" target="_blank">
              <p className="text">{t('sidebar.footer.about')}</p>
            </a>
          )}
          <LanguageSwitcher />
        </div>
      </div>
      <div
        className={classnames('okp4-dataverse-portal-sidebar-collapse-container', {
          expanded: isSidebarExpanded
        })}
        onClick={toggleSidebar}
      >
        <Icon name="chevron" />
      </div>
    </div>
  )
}
