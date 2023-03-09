import classNames from 'classnames'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import type { FC } from 'react'
import { useState, useCallback, useRef } from 'react'
import { isCurrentLanguage } from '@/i18n/utils'
import { useAppStore } from '@/store/appStore'
import { changeLanguage } from 'i18next'
import { useOnClickOutside } from '@/hook/useClickOutside'
import type { Lng } from '@/languages/languages'
import { fallbackLanguage, languages, getActiveLanguage } from '@/languages/languages'
import './languageSwitcher.scss'

type MenuOption = Readonly<{
  value: Lng
  label: string
}>

// eslint-disable-next-line max-lines-per-function
export const LanguageSwitcher: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const isSidebarExpanded = useAppStore(store => store.isSidebarExpanded)
  const mainRef = useRef<HTMLDivElement | null>(null)

  const menuOptions: MenuOption[] = languages
    .map(({ label, lng }) => ({ value: lng, label }))
    .filter(selectOption => !isCurrentLanguage(selectOption.value))

  const activeLanguage = pipe(
    getActiveLanguage(),
    O.getOrElse(() => fallbackLanguage)
  )

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const handleLanguageClick = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const handleMenuItemClick = useCallback(
    (lng: Lng) => () => {
      changeLanguage(lng)
      closeMenu()
    },
    [closeMenu]
  )

  const clickOutsideHandler = useCallback(() => {
    closeMenu()
  }, [closeMenu])

  useOnClickOutside<HTMLDivElement>(mainRef, clickOutsideHandler)

  return (
    <div className="okp4-dataverse-portal-language-switcher-main" ref={mainRef}>
      {isMenuOpen && (
        <div
          className={classNames('okp4-dataverse-portal-language-switcher-menu-container', {
            'sidebar-collapsed': !isSidebarExpanded
          })}
        >
          {menuOptions.map(option => (
            <p
              className="okp4-dataverse-portal-language-switcher-menu-item"
              key={option.value}
              onClick={handleMenuItemClick(option.value)}
            >
              {option.label}
            </p>
          ))}
        </div>
      )}
      <p
        className={classNames('okp4-dataverse-portal-language-switcher-label', {
          active: isMenuOpen
        })}
        onClick={handleLanguageClick}
      >
        {activeLanguage.label}
      </p>
    </div>
  )
}
