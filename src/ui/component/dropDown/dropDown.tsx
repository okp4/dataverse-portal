import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useOnClickOutside } from '@/ui/hook/useOnClickOutside'
import { Icon } from '@/ui/component/icon/icon'
import classnames from 'classnames'
import './dropDown.scss'

export type SubOption = Omit<Option, 'subOptions'> & { parentOptionValue: string }

export type Option = {
  label: string
  value: string
  subOptions?: SubOption[]
}

type DropDownMenu = {
  label: string
  menuOptions: Option[]
}

type DropDownProps = {
  options: Option[]
  onChange: (selectedOption: string, selectedSubOption?: string) => void
  value: string
}

// eslint-disable-next-line max-lines-per-function
export const DropDown: FC<DropDownProps> = ({ options, onChange, value }) => {
  const { t } = useTranslation('common')
  const [menuOpened, setMenuOpened] = useState<boolean>(false)
  const [focusedMenuIndex, setFocusedMenuIndex] = useState<number>(0)
  const [dropDownMenus, setDropDownMenus] = useState<DropDownMenu[]>([])
  const menuContainerRef = useRef<HTMLDivElement | null>(null)
  const dropDownMenusRefs = useRef<HTMLDivElement[]>([])

  const toggleMenu = useCallback(() => {
    setMenuOpened(!menuOpened)
  }, [menuOpened])

  const clickOutsideHandler = useCallback(() => {
    setMenuOpened(false)
  }, [])

  useOnClickOutside(menuContainerRef, clickOutsideHandler)

  const selectOption = useCallback(
    (optionValue: string, subOptionValue?: string) => {
      onChange(optionValue, subOptionValue)
      toggleMenu()
    },
    [onChange, toggleMenu]
  )

  const slideMenu = useCallback(
    (menuIndex: number, nextMenu?: DropDownMenu) => {
      dropDownMenusRefs.current[menuIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
      nextMenu && setDropDownMenus([...dropDownMenus.slice(0, menuIndex + 1), nextMenu])
      setFocusedMenuIndex(menuIndex)
    },
    [dropDownMenus]
  )

  const handleSubOptionClick = useCallback(
    ({ parentOptionValue, value }: SubOption) =>
      () => {
        selectOption(parentOptionValue, value)
      },
    [selectOption]
  )

  const handleOptionClick = useCallback(
    (option: Option, index: number) => () => {
      if (option.subOptions) {
        option.subOptions.length === 1
          ? selectOption(option.value, option.subOptions[0].value)
          : slideMenu(index + 1, { label: option.label, menuOptions: option.subOptions })
      }
    },
    [selectOption, slideMenu]
  )

  const backToPreviousMenu = useCallback(
    (menuIndex: number) => () => {
      slideMenu(menuIndex - 1)
    },
    [slideMenu]
  )

  const handleRefIndexation = useCallback(
    (index: number) => (ref: HTMLDivElement) => (dropDownMenusRefs.current[index] = ref),
    []
  )

  const selectTitle = useMemo(
    () => (dropDownMenus.length ? dropDownMenus[focusedMenuIndex].label : value),
    [focusedMenuIndex, dropDownMenus, value]
  )

  useEffect(() => {
    setDropDownMenus([{ label: value, menuOptions: options }])
    setFocusedMenuIndex(0)
  }, [menuOpened, options, value])

  return (
    <div className="okp4-dataverse-portal-drop-down-menu-main">
      {menuOpened && <div className="okp4-dataverse-portal-drop-down-menu-blur" />}
      <div className="okp4-dataverse-portal-drop-down-menu-container" ref={menuContainerRef}>
        <div
          className={classnames('okp4-dataverse-portal-drop-down-menu-item selected', {
            'menu-opened': menuOpened
          })}
          onClick={toggleMenu}
        >
          <p>{selectTitle}</p>
          <Icon name="chevron-sharp" />
        </div>
        {menuOpened && (
          <div className="okp4-dataverse-portal-drop-down-menus-container">
            {[...dropDownMenus, null].map((menu, index) => (
              <div
                className="okp4-dataverse-portal-drop-down-menu-options-container"
                key={index}
                ref={handleRefIndexation(index)}
              >
                {index !== 0 && (
                  <div
                    className="okp4-dataverse-portal-drop-down-menu-item back-button"
                    onClick={backToPreviousMenu(index)}
                  >
                    <Icon name="arrow-left" />
                    <p>{t('actions.back')}</p>
                  </div>
                )}
                {menu?.menuOptions.map(option => {
                  const hasSubOptions = option.subOptions && option.subOptions.length > 1

                  return (
                    <div
                      className="okp4-dataverse-portal-drop-down-menu-item option"
                      key={option.value}
                      onClick={
                        option.subOptions
                          ? handleOptionClick(option, index)
                          : handleSubOptionClick(option as SubOption)
                      }
                    >
                      <p>{option.label}</p>
                      {hasSubOptions && <Icon name="arrow-right" />}
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
