import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useOnClickOutside } from '@/ui/hook/useOnClickOutside'
import { useAppStore } from '@/ui/store/appStore'
import { Icon } from '@/ui/component/icon/icon'
import classnames from 'classnames'
import './dropDown.scss'

type OptionID = string

export type Option = {
  id: OptionID
  label: string
  value: OptionID[]
}

type DropDownMenuPage = {
  label: string
  menuOptions: Option[]
}

type DropDownMenuProps = {
  options: Option[]
  onSelect: (selectedOptionValue: OptionID[]) => void
  value: string
}

// eslint-disable-next-line max-lines-per-function
export const DropDown: FC<DropDownMenuProps> = ({ options, onSelect, value }) => {
  const [menuOpened, setMenuOpened] = useState<boolean>(false)
  const [focusedMenuPageIndex, setFocusedMenuPageIndex] = useState<number>(0)
  const menuContainerRef = useRef<HTMLDivElement | null>(null)
  const menuPageRefs = useRef<HTMLDivElement[]>([])
  const theme = useAppStore(state => state.theme)
  const { t } = useTranslation('common')
  const firstMenuPage = useMemo(
    () => ({ label: value, menuOptions: options.filter(({ id, value }) => id === value[0]) }),
    [options, value]
  )

  const [menuPages, setMenuPages] = useState<DropDownMenuPage[]>([firstMenuPage])

  const toggleMenu = useCallback(() => {
    setMenuOpened(!menuOpened)
  }, [menuOpened])

  useEffect(() => {
    setMenuPages([firstMenuPage])
    setFocusedMenuPageIndex(0)
  }, [firstMenuPage, menuOpened])

  const clickOutsideHandler = useCallback(() => {
    setMenuOpened(false)
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
        : slideMenu(index + 1, { label: options[0].label, menuOptions: options.slice(1) })
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
    () => (menuPages.length ? menuPages[focusedMenuPageIndex].label : value),
    [focusedMenuPageIndex, menuPages, value]
  )

  return (
    <div className="okp4-dataverse-portal-drop-down-menu-main">
      {menuOpened && <div className="okp4-dataverse-portal-drop-down-menu-blur" />}
      <div className="okp4-dataverse-portal-drop-down-menu-container" ref={menuContainerRef}>
        <div
          className={classnames('okp4-dataverse-portal-drop-down-menu-item', 'selected', {
            'menu-opened': menuOpened
          })}
          onClick={toggleMenu}
        >
          <p>{selectTitle}</p>
          <Icon name={`arrow-down-${theme}`} />
        </div>
        {menuOpened && (
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
                {menuPage?.menuOptions.map(({ id, label }) => {
                  const relatedOptions = options.filter(({ value }) => value.includes(id))

                  return (
                    <div
                      className="okp4-dataverse-portal-drop-down-menu-item option"
                      key={label}
                      onClick={handleOptionClick(relatedOptions, menuPageIndex)}
                    >
                      <p>{label}</p>
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
