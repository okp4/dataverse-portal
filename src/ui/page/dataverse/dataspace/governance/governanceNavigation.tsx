import { useCallback, useMemo } from 'react'
import type { FC } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import classnames from 'classnames'
import { useAppStore } from '@/ui/store/appStore'
import type { IconName } from '@/ui/component/icon/icon'
import { Icon } from '@/ui/component/icon/icon'
import { useBreakpoint } from '@/ui/hook/useBreakpoint'
import { DropDown } from '@/ui/component/dropDown/dropDown'
import type { Option, SubOption } from '@/ui/component/dropDown/dropDown'
import type { SectionDTO, SubSectionDTO } from './mockedData'

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

  const governanceBasePath = `/dataverse/zone/${dataspaceId}/governance`

  const convertToSubOptions = (sectionId: string, subSections: SubSectionDTO[]): SubOption[] =>
    subSections.map(({ id: subSectionId, title: subSectionTitle }) => ({
      label: subSectionTitle,
      parentOptionValue: sectionId,
      value: subSectionId
    }))

  const convertToOptions = useCallback(
    (sections: SectionDTO[]): Option[] =>
      sections.map(({ id: sectionId, title: sectionTitle, contains: subsections }) => ({
        label: sectionTitle,
        value: sectionId,
        subOptions: convertToSubOptions(sectionId, subsections)
      })),

    []
  )

  const options = useMemo(() => convertToOptions(sections), [convertToOptions, sections])

  const selectedOption = useMemo(
    () => options.find(({ value }) => value === activeSectionId)?.label ?? '',
    [activeSectionId, options]
  )

  const handleSelect = useCallback(
    (selectedSection: string, selectedSubSection?: string) => {
      navigate(`${governanceBasePath}/${selectedSection}/${selectedSubSection}`)
    },
    [governanceBasePath, navigate]
  )

  return (
    <nav className="okp4-dataverse-portal-governance-page-navigation">
      {isTablet || isMobile ? (
        <DropDown onChange={handleSelect} options={options} value={selectedOption} />
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
