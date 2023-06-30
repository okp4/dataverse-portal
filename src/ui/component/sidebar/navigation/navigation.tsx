/* eslint-disable max-lines-per-function */
import type { FC } from 'react'
import { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { routes } from '@/ui/routes'
import type { IconName } from '@/ui/component/icon/icon'
import { Icon } from '@/ui/component/icon/icon'
import { useAppStore } from '@/ui/store/appStore'
import './navigation.scss'

type NavigationItem = {
  id: string
  label: string
  path?: string
}

type NavigationItems = Record<string, NavigationItem[]>

type ActiveClassName = {
  isActive: boolean
}

const renderNavitem = (
  isSidebarExpanded: boolean,
  label: string,
  id: string,
  isActive?: boolean
): JSX.Element => (
  <>
    <Icon name={isActive ? (`${id}-active` as IconName) : (id as IconName)} />
    {isSidebarExpanded && <p className="text">{label}</p>}
  </>
)

export const Navigation: FC = () => {
  const { t } = useTranslation('sidebar')
  const navigationItems: NavigationItems = useMemo(
    () => ({
      [t('sidebar.navigation.general.label')]: [
        {
          id: 'home',
          label: t('sidebar.navigation.general.items.home'),
          path: routes.home
        },
        {
          id: 'explore',
          label: t('sidebar.navigation.general.items.explore'),
          path: routes.dataverse
        }
      ],
      [t('sidebar.navigation.interact.label')]: [
        {
          id: 'share',
          label: t('sidebar.navigation.interact.items.share'),
          path: routes.share
        },
        {
          id: 'create-knowledge',
          label: t('sidebar.navigation.interact.items.createKnowledge')
        },
        {
          id: 'create-zone',
          label: t('sidebar.navigation.interact.items.createZones')
        },
        {
          id: 'build-apps',
          label: t('sidebar.navigation.interact.items.buildApps')
        }
      ],
      [t('sidebar.navigation.learn.label')]: [
        {
          id: 'documentation',
          label: t('sidebar.navigation.learn.items.documentation')
        },
        {
          id: 'help',
          label: t('sidebar.navigation.learn.items.help')
        }
      ]
    }),
    [t]
  )

  const isSidebarExpanded = useAppStore(store => store.isSidebarExpanded)
  const navLinkClassName = useCallback(
    ({ isActive }: ActiveClassName) => (isActive ? 'active' : undefined),
    []
  )
  return (
    <nav
      className={classnames('okp4-dataverse-portal-sidebar-navigation-container', {
        collapsed: !isSidebarExpanded
      })}
    >
      {Object.entries(navigationItems).map((group, index) => (
        <div
          className={classnames('okp4-dataverse-portal-sidebar-navigation-block', {
            collapsed: !isSidebarExpanded
          })}
          key={index}
        >
          {isSidebarExpanded && <h3>{group[0]}</h3>}
          {group[1].map(({ label, id, path }) => {
            return path ? (
              <NavLink className={navLinkClassName} key={id} title={label} to={path}>
                {({ isActive }: ActiveClassName): JSX.Element =>
                  renderNavitem(isSidebarExpanded, label, id, isActive)
                }
              </NavLink>
            ) : (
              <div className="okp4-dataverse-portal-sidebar-deactivated-navitem" key={id}>
                {renderNavitem(isSidebarExpanded, label, id)}
              </div>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
