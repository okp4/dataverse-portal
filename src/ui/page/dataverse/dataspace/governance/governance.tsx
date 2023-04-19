import type { FC } from 'react'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GovernanceContent } from './governanceContent'
import { mockedGovernanceChapter } from './mockedData'
import './governance.scss'

export const Governance: FC = () => {
  const navigate = useNavigate()
  const { id, sectionId: sectionIdParams, subsectionId: subsectionIdParams } = useParams<string>()

  const sections = mockedGovernanceChapter.contains
  const currentSection = sections.find(section => section.id === sectionIdParams)
  const currentSubsection = currentSection?.contains.find(
    subsection => subsection.id === subsectionIdParams
  )

  useEffect(() => {
    const firstSection = sections[0]
    const firstSectionId = firstSection.id
    const firstSubsection = firstSection.contains[0]
    const firstSubsectionId = firstSubsection.id

    if (!sectionIdParams && !subsectionIdParams) {
      return navigate(`${firstSectionId}/${firstSubsectionId}`)
    }

    if (sectionIdParams && subsectionIdParams) {
      if (currentSection && currentSubsection) {
        return navigate(`${currentSection.id}/${currentSubsection.id}`)
      }
      return navigate('/404')
    }

    if (sectionIdParams && !subsectionIdParams) {
      if (currentSection) {
        return navigate(`${currentSection.id}/${currentSection.contains[0].id}`)
      }
      return navigate('/404')
    }
  }, [navigate, currentSection, currentSubsection, sections, sectionIdParams, subsectionIdParams])

  return (
    <GovernanceContent
      activeSection={currentSection}
      activeSubsection={currentSubsection}
      id={id}
      sections={sections}
    />
  )
}
