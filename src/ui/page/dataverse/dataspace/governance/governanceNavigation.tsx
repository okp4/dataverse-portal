/* eslint-disable max-lines-per-function */
import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { NavLink } from 'react-router-dom'
import type { SectionDTO } from './governance'

type GovernanceWithNavigationProps = {
  sections: SectionDTO[]
}
// TODO: add translation for nav links
export const GovernanceNavigation: FC<GovernanceWithNavigationProps> = ({ sections }) => {
  const [activeLink, setActiveLink] = useState<string>(sections[0].title)
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
        {sections.map(({ id: sectionId, title: sectionTitle, contains: subsections }) => (
          <li key={sectionId}>
            <NavLink
              className={navlinkClassName({ isActive: sectionId === activeLink, isPending: false })}
              onClick={handleNavLinkClick(sectionId)}
              relative="route"
              to={`${sectionId}`}
            >
              {sectionTitle}
            </NavLink>
            {subsections.length > 0 && (
              <ul>
                {subsections.map(({ title: subsectionTitle, id: subsectionId }) => (
                  <li key={subsectionTitle}>
                    <NavLink
                      className={navlinkClassName({
                        isActive: subsectionTitle === activeLink,
                        isPending: false
                      })}
                      onClick={handleNavLinkClick(subsectionTitle)}
                      relative="route"
                      to={`${sectionId}/${subsectionId}`}
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
