import { useCallback, useMemo } from 'react'
import type { FC } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/ui/store/appStore'
import type { IconName } from '@/ui/component/icon/icon'
import { Icon } from '@/ui/component/icon/icon'
import { useBreakpoint } from '@/ui/hook/useBreakpoint'
import { DropDownMenu } from '@/ui/component/dropDownMenu/dropDownMenu'
import type { Option } from '@/ui/component/dropDownMenu/dropDownMenu'
import classnames from 'classnames'
import type { SectionDTO } from './mockedData'

type GovernanceWithNavigationProps = {
  dataspaceId: string
  sections: SectionDTO[]
  activeSectionId: string
}

// eslint-disable-next-line max-lines-per-function
export const GovernanceNavigation: FC<GovernanceWithNavigationProps> = ({
  dataspaceId,
  sections,
  activeSectionId
}) => {
  const theme = useAppStore(state => state.theme)
  const { isMobile, isTablet } = useBreakpoint()
  const navigate = useNavigate()

  const navLinkClassName = useCallback(
    ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : undefined),
    []
  )

  const governanceBasePath = `/dataverse/dataspace/${dataspaceId}/governance`

  const convertToOptions = useCallback(
    (sections: SectionDTO[]): Option[] =>
      sections.flatMap(({ id: sectionId, title: sectionTitle, contains }) =>
        contains.length > 1
          ? [
              {
                id: sectionId,
                label: sectionTitle,
                value: [sectionId]
              },
              ...contains.map(({ id: subSectionId, title: subSectionTitle }) => ({
                id: subSectionId,
                label: subSectionTitle,
                value: [sectionId, subSectionId]
              }))
            ]
          : {
              id: sectionId,
              label: sectionTitle,
              value: [sectionId, contains[0].id]
            }
      ),
    []
  )

  const dropDownMenuOptions = useMemo(
    () => convertToOptions(sections),
    [convertToOptions, sections]
  )

  const dropDownMenuSelectedTitle = useMemo(
    () => dropDownMenuOptions.find(({ id }) => id === activeSectionId)?.label ?? '',
    [activeSectionId, dropDownMenuOptions]
  )

  const handleSelect = useCallback(
    ([sectionId, subSectionId]: string[]) => {
      navigate(`${governanceBasePath}/${sectionId}/${subSectionId}`)
    },
    [governanceBasePath, navigate]
  )

  return (
    <nav className="okp4-dataverse-portal-governance-page-navigation">
      {isTablet || isMobile ? (
        <DropDownMenu
          onSelect={handleSelect}
          options={dropDownMenuOptions}
          value={dropDownMenuSelectedTitle}
        />
      ) : (
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
      )}
    </nav>
  )
}
