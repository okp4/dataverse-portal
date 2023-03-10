import classNames from 'classnames'
import type { FC } from 'react'
import { useState, useCallback, useRef } from 'react'
import { isCurrentLanguage } from '@/i18n/utils'
import { useAppStore } from '@/store/appStore'
import { changeLanguage } from 'i18next'
import { useOnClickOutside } from '@/hook/useOnClickOutside'
import { useOnKeyboard } from '@/hook/useOnKeyboard'
import type { Lng } from '@/languages/languages'
import { activeLanguageWithDefault, languages } from '@/languages/languages'
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

  const handleMenuItemKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter') setIsMenuOpen(true)
      else if (event.key === 'Escape') closeMenu()
    },
    [setIsMenuOpen, closeMenu]
  )

  useOnClickOutside<HTMLDivElement>(mainRef, clickOutsideHandler)
  useOnKeyboard(handleMenuItemKeydown, 'keydown', mainRef)

  return (
    <div className="okp4-dataverse-portal-language-switcher-main" ref={mainRef} tabIndex={0}>
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
        {activeLanguageWithDefault().label}
      </p>
    </div>
  )
}
