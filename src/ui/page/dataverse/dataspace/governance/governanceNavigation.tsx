/* eslint-disable max-lines-per-function */
import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { useAppStore } from '@/ui/store/appStore'
import type { IconName } from '@/ui/component/icon/icon'
import { Icon } from '@/ui/component/icon/icon'
import type { SectionDTO } from './mockedData'

type GovernanceWithNavigationProps = {
  sections: SectionDTO[]
  activeSectionId?: string
  activeSubsectionId?: string
}
// TODO: add translation for nav links
export const GovernanceNavigation: FC<GovernanceWithNavigationProps> = ({
  sections,
  activeSectionId,
  activeSubsectionId
}) => {
  const theme = useAppStore(state => state.theme)
  const [activeSection, setActiveSection] = useState<string>(activeSectionId ?? sections[0].id)
  const [activeSubsection, setActiveSubsection] = useState<string>(
    activeSubsectionId ?? sections[0].contains[0].id
  )

  const handleNavSectionClick = useCallback(
    (section: SectionDTO) => () => {
      setActiveSection(section.id)
      setActiveSubsection(section.contains[0].id)
    },
    []
  )
  const handleNavSubsectionClick = useCallback(
    (sectionId: string, subsectionId: string) => () => {
      setActiveSection(sectionId)
      setActiveSubsection(subsectionId)
    },
    []
  )
  const navlinkClassName = useCallback(
    ({ isActive, isPending }: { isActive: boolean; isPending: boolean }): string =>
      isPending ? 'pending' : isActive ? 'active' : '',
    []
  )

  return (
    <nav className={`okp4-dataverse-portal-governance-page-navigation`}>
      <ul className="okp4-dataverse-portal-governance-page-navigation-section-list">
        {sections.map(section => {
          const { id: sectionId, title: sectionTitle, contains: subsections } = section
          const isSectionActive = sectionId === activeSection
          const hasMoreThanOneSubsection = subsections.length > 1
          return (
            <li
              className={`okp4-dataverse-portal-governance-page-navigation-section-list-item`}
              key={sectionId}
            >
              <NavLink
                className={classnames(
                  'okp4-dataverse-portal-governance-page-navigation-section-link',
                  navlinkClassName({ isActive: isSectionActive, isPending: false })
                )}
                onClick={handleNavSectionClick(section)}
                relative="route"
                to={`${sectionId}/${subsections[0].id}`}
              >
                {sectionTitle}
              </NavLink>
              {subsections.length > 0 && (
                <ul
                  className={classnames(
                    'okp4-dataverse-portal-governance-page-navigation-subsection-list',
                    hasMoreThanOneSubsection && isSectionActive ? 'visible' : 'hidden'
                  )}
                >
                  {subsections.map(({ title: subsectionTitle, id: subsectionId }) => {
                    const isSubsectionActive = subsectionId === activeSubsection
                    return (
                      <li
                        className={`okp4-dataverse-portal-governance-page-navigation-subsection-list-item`}
                        key={subsectionId}
                      >
                        <div
                          className={`okp4-dataverse-portal-governance-page-navigation-subsection-list-style`}
                        >
                          <Icon name={`hook-${theme}` as IconName} />
                        </div>
                        <NavLink
                          className={classnames(
                            'okp4-dataverse-portal-governance-page-navigation-subsection-link',
                            navlinkClassName({
                              isActive: isSubsectionActive,
                              isPending: false
                            })
                          )}
                          onClick={handleNavSubsectionClick(sectionId, subsectionId)}
                          relative="route"
                          to={`${sectionId}/${subsectionId}`}
                        >
                          {subsectionTitle}
                        </NavLink>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
