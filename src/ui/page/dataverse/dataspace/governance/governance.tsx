import type { FC } from 'react'
import { useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import './governance.scss'
import { GovernanceContent } from './governanceContent'
import type { SectionDTO } from './mockedData'
import { mockedGovernanceChapter } from './mockedData'

export const Section: FC = () => {
  const { subsectionId } = useParams<{ subsectionId: string }>()
  const section = useOutletContext<SectionDTO>()
  const subsection =
    section.contains.find(subSection => subSection.id === subsectionId) ?? section.contains[0]
  return (
    <section>
      <h2>{section.title}</h2>
      <section>
        <h3>{subsection.title}</h3>
      </section>
    </section>
  )
}

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

    if (!currentSection && !currentSubsection) {
      navigate(`${firstSectionId}/${firstSubsectionId}`)
    }
    if (currentSection && !currentSubsection) {
      navigate(`${currentSection.id}/${currentSection.contains[0].id}`)
    }
  }, [navigate, currentSection, currentSubsection, sections])

  return (
    <GovernanceContent
      activeSection={currentSection}
      activeSubsection={currentSubsection}
      id={id}
      sections={sections}
    />
  )
}
