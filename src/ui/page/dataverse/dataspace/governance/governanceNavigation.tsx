/* eslint-disable max-lines-per-function */
import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { NavLink } from 'react-router-dom'

type SectionWithSubsections = {
  title: string
  subsectionsTitles: string[]
}

type GovernanceWithNavigationProps = {
  sectionsWithSubsections: SectionWithSubsections[]
}
// TODO: add translation for nav links
export const GovernanceNavigation: FC<GovernanceWithNavigationProps> = ({
  sectionsWithSubsections
}) => {
  const [activeLink, setActiveLink] = useState<string>(sectionsWithSubsections[0].title)
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false)

  const handleNavLinkClick = useCallback(
    (link: string) => () => {
      setActiveLink(link)
      setDropdownVisible(false)
    },
    []
  )

  const toggleDropdown = useCallback(() => {
    setDropdownVisible(!dropdownVisible)
  }, [dropdownVisible])

  const navlinkClassName = useCallback(
    ({ isActive, isPending }: { isActive: boolean; isPending: boolean }): string =>
      isPending ? 'pending' : isActive ? 'active' : '',
    []
  )

  return (
    <nav className={`nav-menu${dropdownVisible ? ' open' : ''}`}>
      <button className="nav-toggle" onClick={toggleDropdown}>
        {activeLink}
        <span className="arrow"></span>
      </button>
      <ul>
        {sectionsWithSubsections.map(({ title, subsectionsTitles }) => (
          <li key={title}>
            <NavLink
              className={navlinkClassName({ isActive: title === activeLink, isPending: false })}
              onClick={handleNavLinkClick(title)}
              relative="route"
              to={`${title}`}
            >
              {title}
            </NavLink>
            {subsectionsTitles.length > 0 && (
              <ul>
                {subsectionsTitles.map(subsectionTitle => (
                  <li key={subsectionTitle}>
                    <NavLink
                      className={navlinkClassName({
                        isActive: subsectionTitle === activeLink,
                        isPending: false
                      })}
                      onClick={handleNavLinkClick(subsectionTitle)}
                      relative="route"
                      to={`${title}/${subsectionTitle}`}
                    >
                      {subsectionTitle}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
