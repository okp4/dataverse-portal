/* eslint-disable max-lines-per-function */
import type { FC } from 'react'
import { useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { useAppStore } from '@/ui/store/appStore'
import type { IconName } from '@/ui/component/icon/icon'
import { Icon } from '@/ui/component/icon/icon'
import type { SectionDTO } from './mockedData'

type GovernanceWithNavigationProps = {
  dataspaceId: string
  sections: SectionDTO[]
  activeSectionId: string
}

export const GovernanceNavigation: FC<GovernanceWithNavigationProps> = ({
  dataspaceId,
  sections,
  activeSectionId
}) => {
  const theme = useAppStore(state => state.theme)

  const navLinkClassName = useCallback(
    ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : undefined),
    []
  )

  const governanceBasePath = `/dataverse/dataspace/${dataspaceId}/governance`

  return (
    <nav className="okp4-dataverse-portal-governance-page-navigation">
      <ul className="okp4-dataverse-portal-governance-page-navigation-section-list">
        {sections.map(({ title: sectionTitle, contains: subsections, id: sectionId }) => {
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
                  navLinkClassName({ isActive: isSectionActive })
                )}
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
                {subsections.map(({ title: subsectionTitle, id: subsectionId }) => (
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
                        { navLinkClassName }
                      )}
                      to={`${governanceBasePath}/${sectionId}/${subsectionId}`}
                    >
                      {subsectionTitle}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
