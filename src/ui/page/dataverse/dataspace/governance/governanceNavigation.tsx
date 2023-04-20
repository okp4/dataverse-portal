/* eslint-disable max-lines-per-function */
import type { FC } from 'react'
import { useEffect, useCallback, useState } from 'react'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { useAppStore } from '@/ui/store/appStore'
import type { IconName } from '@/ui/component/icon/icon'
import { Icon } from '@/ui/component/icon/icon'
import type { SectionDTO } from './mockedData'

type GovernanceWithNavigationProps = {
  dataspaceId: string
  sections: SectionDTO[]
  sectionId: string
  subsectionId: string
}

export const GovernanceNavigation: FC<GovernanceWithNavigationProps> = ({
  dataspaceId,
  sections,
  sectionId,
  subsectionId
}) => {
  const theme = useAppStore(state => state.theme)

  const [activeSectionId, setActiveSectionId] = useState<string>(sectionId)
  const [activeSubsectionId, setActiveSubsectionId] = useState<string>(subsectionId)
  useEffect(() => {
    setActiveSectionId(sectionId)
    setActiveSubsectionId(subsectionId)
  }, [sectionId, subsectionId])

  const handleNavSectionClick = useCallback(
    (section: SectionDTO) => () => {
      setActiveSectionId(section.id)
      setActiveSubsectionId(section.contains[0].id)
    },
    []
  )
  const handleNavSubsectionClick = useCallback(
    (sectionId: string, subsectionId: string) => () => {
      setActiveSubsectionId(subsectionId)
    },
    []
  )

  const governanceBasePath = `/dataverse/dataspace/${dataspaceId}/governance`

  return (
    <nav className="okp4-dataverse-portal-governance-page-navigation">
      <ul className="okp4-dataverse-portal-governance-page-navigation-section-list">
        {sections.map(section => {
          const { id: sectionId, title: sectionTitle, contains: subsections } = section
          const isSectionActive = sectionId === activeSectionId
          const hasMoreThanOneSubsection = subsections.length > 1
          return (
            <li
              className="okp4-dataverse-portal-governance-page-navigation-section-list-item"
              key={sectionId}
            >
              <NavLink
                className={classnames(
                  'okp4-dataverse-portal-governance-page-navigation-section-link',
                  { active: isSectionActive }
                )}
                onClick={handleNavSectionClick(section)}
                to={`${governanceBasePath}/${sectionId}/${subsections[0].id}`}
              >
                {sectionTitle}
              </NavLink>
              <ul
                className={classnames(
                  'okp4-dataverse-portal-governance-page-navigation-subsection-list',
                  hasMoreThanOneSubsection && isSectionActive ? 'visible' : 'hidden'
                )}
              >
                {subsections.map(({ title: subsectionTitle, id: subsectionId }) => {
                  const isSubsectionActive = subsectionId === activeSubsectionId
                  return (
                    <li
                      className="okp4-dataverse-portal-governance-page-navigation-subsection-list-item"
                      key={subsectionId}
                    >
                      <div className="okp4-dataverse-portal-governance-page-navigation-subsection-list-style">
                        <Icon name={`hook-${theme}` as IconName} />
                      </div>
                      <NavLink
                        className={classnames(
                          'okp4-dataverse-portal-governance-page-navigation-subsection-link',
                          { active: isSubsectionActive }
                        )}
                        onClick={handleNavSubsectionClick(sectionId, subsectionId)}
                        to={`${governanceBasePath}/${sectionId}/${subsectionId}`}
                      >
                        {subsectionTitle}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
