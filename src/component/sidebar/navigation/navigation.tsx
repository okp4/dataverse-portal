import type { FC } from 'react'
import { useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { routes } from '@/routes'
import type { IconName } from '@/component/icon/icon'
import { Icon } from '@/component/icon/icon'
import { useAppStore } from '@/store/appStore'
import './navigation.scss'

type NavigationGroup = 'general' | 'interact' | 'learn'

type NavigationItem = {
  id: string
  label: string
  path: string
}

type NavigationItems = Record<NavigationGroup, NavigationItem[]>

type ActiveClassName = {
  isActive: boolean
}

const navigationItems: NavigationItems = {
  general: [
    {
      id: 'home',
      label: 'Home',
      path: routes.home
    },
    {
      id: 'explore',
      label: 'Explore',
      path: routes.catalog
    },
    {
      id: 'dataspace',
      label: 'My Data Spaces',
      path: routes.myDataspaces
    }
  ],
  interact: [
    {
      id: 'share',
      label: 'Share Data & Services',
      path: routes.sharing
    },
    {
      id: 'create-knowledge',
      label: 'Create Knowledge',
      path: routes.knowledgeBuilder
    },
    {
      id: 'create-dataspace',
      label: 'Create Data Space',
      path: routes.dataspaceBuilder
    },
    {
      id: 'build-apps',
      label: 'Build Applications',
      path: routes.appBuilder
    }
  ],
  learn: [
    {
      id: 'documentation',
      label: 'Documentation',
      path: routes.documentation
    },
    {
      id: 'help',
      label: 'Help Center',
      path: routes.help
    }
  ]
}

export const Navigation: FC = () => {
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
          {group[1].map(({ label, id, path }) => (
            <NavLink className={navLinkClassName} key={id} title={label} to={path}>
              {({ isActive }: ActiveClassName): JSX.Element => (
                <>
                  <Icon name={isActive ? (`${id}-active` as IconName) : (id as IconName)} />
                  {isSidebarExpanded && <p className="text">{label}</p>}
                </>
              )}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  )
}
