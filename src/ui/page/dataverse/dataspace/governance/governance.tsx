import type { FC } from 'react'
import { useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GovernanceContent } from './governanceContent'
import { mockedGovernanceChapter } from './mockedData'
import './governance.scss'

// eslint-disable-next-line max-lines-per-function
export const Governance: FC = () => {
  const navigate = useNavigate()
  const {
    id: dataspaceId,
    sectionId: sectionIdParams,
    subsectionId: subsectionIdParams
  } = useParams<string>()

  const sections = mockedGovernanceChapter.contains
  const currentSection = sections.find(section => section.id === sectionIdParams)
  const currentSubsection = currentSection?.contains.find(
    subsection => subsection.id === subsectionIdParams
  )

  const getNavigationPath = useCallback((): string | null => {
    const governanceBasePath = `/dataverse/dataspace/${dataspaceId}/governance`
    const firstSection = sections[0]
    const firstSubsection = firstSection.contains[0]

    if (!sectionIdParams && !subsectionIdParams) {
      return `${governanceBasePath}/${firstSection.id}/${firstSubsection.id}`
    }

    if (sectionIdParams && subsectionIdParams && currentSection && currentSubsection) {
      return `${governanceBasePath}/${currentSection.id}/${currentSubsection.id}`
    }

    if (sectionIdParams && !subsectionIdParams && currentSection) {
      return `${governanceBasePath}/${currentSection.id}/${currentSection.contains[0].id}`
    }

    return null
  }, [
    dataspaceId,
    sectionIdParams,
    subsectionIdParams,
    currentSection,
    currentSubsection,
    sections
  ])

  useEffect(() => {
    const navigationPath = getNavigationPath()

    if (navigationPath) {
      return navigate(navigationPath, { replace: true })
    }
    navigate('/404')
  }, [navigate, getNavigationPath])

  if (!dataspaceId) {
    return <p>dataverse item not found</p>
  }

  return (
    <GovernanceContent
      activeSection={currentSection}
      activeSubsection={currentSubsection}
      dataspaceId={dataspaceId}
      sections={sections}
    />
  )
}
