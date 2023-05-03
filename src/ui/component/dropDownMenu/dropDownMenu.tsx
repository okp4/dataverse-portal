import { useCallback, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useOnClickOutside } from '@/ui/hook/useOnClickOutside'
import { useAppStore } from '@/ui/store/appStore'
import { Icon } from '@/ui/component/icon/icon'
import classnames from 'classnames'
import './dropDownMenu.scss'

type OptionID = string

export type Option = {
  id: OptionID
  title: string
  value: OptionID[]
}

type DropDownMenuPage = {
  title: string
  menuOptions: Option[]
}

type DropDownMenuProps = {
  options: Option[]
  onSelect: (selectedOptionValue: OptionID[]) => void
  selectedTitle: string
}

// eslint-disable-next-line max-lines-per-function
export const DropDownMenu: FC<DropDownMenuProps> = ({ options, onSelect, selectedTitle }) => {
  const [menuPages, setMenuPages] = useState<DropDownMenuPage[]>([])
  const [focusedMenuPageIndex, setFocusedMenuPageIndex] = useState<number>(0)
  const menuContainerRef = useRef<HTMLDivElement | null>(null)
  const menuPageRefs = useRef<HTMLDivElement[]>([])
  const theme = useAppStore(state => state.theme)
  const { t } = useTranslation('common')
  const firstMenuPageOptions = useMemo(
    () => options.filter(({ id, value }) => id === value[0]),
    [options]
  )

  const toggleMenu = useCallback(() => {
    menuPages.length
      ? setMenuPages([])
      : setMenuPages([{ title: selectedTitle, menuOptions: firstMenuPageOptions }])
    setFocusedMenuPageIndex(0)
  }, [menuPages.length, selectedTitle, firstMenuPageOptions])

  const clickOutsideHandler = useCallback(() => {
    setMenuPages([])
    setFocusedMenuPageIndex(0)
  }, [])

  useOnClickOutside(menuContainerRef, clickOutsideHandler)

  const selectOption = useCallback(
    (selectedValue: OptionID[]) => {
      onSelect(selectedValue)
      toggleMenu()
    },
    [onSelect, toggleMenu]
  )

  const slideMenu = useCallback(
    (menuPageIndex: number, menuPage?: DropDownMenuPage) => {
      menuPageRefs.current[menuPageIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
      menuPage && setMenuPages([...menuPages.slice(0, menuPageIndex), menuPage])
      setFocusedMenuPageIndex(menuPageIndex)
    },
    [menuPages]
  )

  const handleOptionClick = useCallback(
    (options: Option[], index: number) => () => {
      options.length === 1
        ? selectOption(options[0].value)
        : slideMenu(index + 1, { title: options[0].title, menuOptions: options.slice(1) })
    },
    [selectOption, slideMenu]
  )

  const handleMenuBack = useCallback(
    (menuPageIndex: number) => () => {
      slideMenu(menuPageIndex - 1)
    },
    [slideMenu]
  )

  const handleRefIndexation = useCallback(
    (index: number) => (ref: HTMLDivElement) => (menuPageRefs.current[index] = ref),
    []
  )

  const selectTitle = useMemo(
    () => (menuPages.length ? menuPages[focusedMenuPageIndex].title : selectedTitle),
    [focusedMenuPageIndex, menuPages, selectedTitle]
  )

  return (
    <div className="okp4-dataverse-portal-drop-down-menu-main">
      {!!menuPages.length && <div className="okp4-dataverse-portal-drop-down-menu-blur" />}
      <div className="okp4-dataverse-portal-drop-down-menu-container" ref={menuContainerRef}>
        <div
          className={classnames('okp4-dataverse-portal-drop-down-menu-item', 'selected', {
            'menu-opened': !!menuPages.length
          })}
          onClick={toggleMenu}
        >
          <p>{selectTitle}</p>
          <Icon name={`arrow-down-${theme}`} />
        </div>
        {!!menuPages.length && (
          <div className="okp4-dataverse-portal-drop-down-menus-container">
            {[...menuPages, null].map((menuPage, menuPageIndex) => (
              <div
                className={classnames('okp4-dataverse-portal-drop-down-menu-options-container', {
                  focused: menuPageIndex === focusedMenuPageIndex
                })}
                key={menuPageIndex}
                ref={handleRefIndexation(menuPageIndex)}
              >
                {menuPageIndex !== 0 && (
                  <div
                    className="okp4-dataverse-portal-drop-down-menu-item back-button"
                    onClick={handleMenuBack(menuPageIndex)}
                  >
                    <Icon name="arrow-left" />
                    <p>{t('actions.back')}</p>
                  </div>
                )}
                {menuPage?.menuOptions.map(({ id, title }) => {
                  const relatedOptions = options.filter(({ value }) => value.includes(id))

                  return (
                    <div
                      className="okp4-dataverse-portal-drop-down-menu-item option"
                      key={title}
                      onClick={handleOptionClick(relatedOptions, menuPageIndex)}
                    >
                      <p>{title}</p>
                      {options.filter(({ value }) => id === value[0]).length > 1 && (
                        <Icon name="arrow-right" />
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
