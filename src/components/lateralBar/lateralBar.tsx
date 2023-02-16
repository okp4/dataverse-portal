'use client'
import type { ThemeContextType } from '@/context/themeContext'
import { useTheme } from '@/hooks/useTheme'
import Image from 'next/image'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import { Okp4Logo } from '../logo/okp4Logo'
import { Switch } from '../switch/switch'
import './lateralBar.scss'
import moonIcon from '../../../public/icons/moon-icon.svg'
import sunIcon from '../../../public/icons/sun-icon.svg'
import expand from '../../../public/icons/expand.svg'
import collapse from '../../../public/icons/collapse.svg'
import type { Route } from '@/routes'
import { appRoutes } from '@/routes'
import { usePathname } from 'next/navigation'
import classnames from 'classnames'
import { FeedbackButton } from '../buttons/feedback/feedbackButton'
import { useAppStore } from '@/stores/appStore'
import type { LocalStorageState } from '@/hooks/useLocalStorage'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const socialMedias = [
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

const groupedRoutes = appRoutes.reduce<Record<string, Omit<Route, 'group'>[]>>(
  (acc, { name, id, path, group }) => ({
    ...acc,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    [group]: acc[group] ? [...acc[group], { name, id, path }] : [{ name, id, path }]
  }),
  {}
)

const localStorageKey = 'okp4-theme'

// eslint-disable-next-line max-lines-per-function
const LateralBar: FC = () => {
  const isExpanded = useAppStore(store => store.isExpanded)
  const expandLateralBar = useAppStore(store => store.expand)
  const collapseLateralBar = useAppStore(store => store.collapse)
  const { theme, setTheme }: ThemeContextType = useTheme()
  const [, setValue]: LocalStorageState = useLocalStorage(localStorageKey)
  const pathname = usePathname()

  const handleCheck = useCallback(
    (checked: boolean): void => {
      const selectedTheme = checked ? 'light' : 'dark'
      setTheme(selectedTheme)
      setValue(selectedTheme)
    },
    [setTheme, setValue]
  )
  return (
    <div
      className={classnames('okp4-dataverse-portal-lateral-bar-main', {
        collapsed: !isExpanded
      })}
    >
      <div
        className="okp4-dataverse-portal-lateral-bar-collapse-container"
        onClick={isExpanded ? collapseLateralBar : expandLateralBar}
      >
        <Image alt="expand-lateral-bar-icon" src={isExpanded ? collapse : expand} />
      </div>
      <div
        className={classnames('okp4-dataverse-portal-lateral-bar-title-container', {
          collapsed: !isExpanded
        })}
      >
        <Okp4Logo logoOnly={!isExpanded} />
        <Switch
          icons={{
            checked: <Image alt="sun-icon" src={sunIcon} />,
            notChecked: <Image alt="moon-icon" src={moonIcon} />
          }}
          isChecked={theme === 'light'}
          onCheckedChange={handleCheck}
        />
      </div>
      <div
        className={classnames('okp4-dataverse-portal-lateral-bar-content-container', {
          collapsed: !isExpanded
        })}
      >
        {Object.entries(groupedRoutes).map((group, index) => (
          <div
            className={classnames('okp4-dataverse-portal-lateral-bar-content-block', {
              collapsed: !isExpanded
            })}
            key={index}
          >
            {isExpanded && <h3>{group[0]}</h3>}
            {group[1].map(({ name, id, path }) => {
              const isActivePath = pathname === path
              return (
                <div
                  className="okp4-dataverse-portal-lateral-bar-content-item"
                  key={id}
                  title={name}
                >
                  <div className={`${id}-${isActivePath ? 'active' : theme}`} />
                  {isExpanded && (
                    <p className={classnames('text', { active: isActivePath })}>{name}</p>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div
        className={classnames('okp4-dataverse-portal-lateral-bar-footer-container', {
          collapsed: !isExpanded
        })}
      >
        {isExpanded && <FeedbackButton />}
        <div
          className={classnames(
            'okp4-dataverse-portal-lateral-bar-footer-social-medias-container',
            { collapsed: !isExpanded }
          )}
        >
          {socialMedias.map(({ id, href }) => (
            <a href={href} key={id} rel="noreferrer" target="_blank">
              <div className={`${id}-${theme}`} />
            </a>
          ))}
        </div>
        {isExpanded && (
          <a href="https://www.okp4.network" rel="noreferrer" target="_blank">
            <p className="text">About OKP4</p>
          </a>
        )}
      </div>
    </div>
  )
}

export default LateralBar
