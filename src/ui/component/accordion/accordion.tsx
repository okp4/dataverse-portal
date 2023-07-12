import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { useOnClickOutside } from '@/ui/hook/useOnClickOutside'
import { Icon } from '@/ui/component/icon/icon'
import './accordion.scss'

export type SubOption = Omit<Option, 'subOptions'> & { parentOptionValue: string }

export type Option = {
  label: string
  value: string
  subOptions?: SubOption[]
}

type AccordionMenu = {
  label: string
  menuOptions: Option[]
}

type AccordionProps = {
  options: Option[]
  onChange: (selectedOption: string, selectedSubOption?: string) => void
  value: string
}

// eslint-disable-next-line max-lines-per-function
export const Accordion: FC<AccordionProps> = ({ options, onChange, value }) => {
  const { t } = useTranslation('common')
  const [menuOpened, setMenuOpened] = useState<boolean>(false)
  const [focusedMenuIndex, setFocusedMenuIndex] = useState<number>(0)
  const [accordionMenus, setAccordionMenus] = useState<AccordionMenu[]>([])
  const menuContainerRef = useRef<HTMLDivElement | null>(null)
  const accordionMenusRefs = useRef<HTMLDivElement[]>([])

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
    (menuIndex: number, nextMenu?: AccordionMenu) => {
      accordionMenusRefs.current[menuIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
      nextMenu && setAccordionMenus([accordionMenus[0], nextMenu])
      setFocusedMenuIndex(menuIndex)
    },
    [accordionMenus]
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

  const assignMenuRef = useCallback(
    (index: number) => (ref: HTMLDivElement) => (accordionMenusRefs.current[index] = ref),
    []
  )

  const accordionTitle = useMemo(
    () => (accordionMenus.length ? accordionMenus[focusedMenuIndex].label : value),
    [focusedMenuIndex, accordionMenus, value]
  )

  const accordionSlidingMenus =
    accordionMenus.length === 1 ? [...accordionMenus, null] : accordionMenus

  useEffect(() => {
    setAccordionMenus([{ label: value, menuOptions: options }])
    setFocusedMenuIndex(0)
  }, [menuOpened, options, value])

  return (
    <div className="okp4-dataverse-portal-accordion-menu-main">
      {menuOpened && <div className="okp4-dataverse-portal-accordion-menu-blur" />}
      <div className="okp4-dataverse-portal-accordion-menu-container" ref={menuContainerRef}>
        <div
          className={classnames('okp4-dataverse-portal-accordion-menu-item selected', {
            'menu-opened': menuOpened
          })}
          onClick={toggleMenu}
        >
          <p>{accordionTitle}</p>
          <Icon name="chevron-sharp" />
        </div>
        {menuOpened && (
          <div className="okp4-dataverse-portal-accordion-menus-container">
            {accordionSlidingMenus.map((menu, index) => (
              <div
                className={classnames('okp4-dataverse-portal-accordion-menu-options-container', {
                  focused: index === focusedMenuIndex
                })}
                key={index}
                ref={assignMenuRef(index)}
              >
                {index !== 0 && (
                  <div
                    className="okp4-dataverse-portal-accordion-menu-item back-button"
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
                      className="okp4-dataverse-portal-accordion-menu-item option"
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
