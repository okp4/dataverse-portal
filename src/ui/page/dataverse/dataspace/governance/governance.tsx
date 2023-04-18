import type { FC } from 'react'
import { useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import './governance.scss'
import { GovernanceContent } from './governanceContent'

type ID = {
  id: string
}

type DescribableDTO = {
  title: string
  description?: string
}

type DescriptedDTO = ID & DescribableDTO

type Numbered = {
  number: string
}

type NonEmptyArray<T> = [T, ...T[]]

type Container<T> = {
  contains: NonEmptyArray<T>
}

type ParagraphDTOWithNumber = Omit<DescriptedDTO, 'description'> &
  Numbered & {
    description: string
  }

type DescriptedDTOWithNumber = DescriptedDTO & Numbered

type ParagraphDTO = ParagraphDTOWithNumber

type ArticleDTO = DescriptedDTOWithNumber & Container<ParagraphDTO>

export type SubSectionDTO = DescriptedDTOWithNumber & Container<ArticleDTO>

export type SectionDTO = DescriptedDTOWithNumber & Container<SubSectionDTO>

type Chapter = DescriptedDTO & Container<SectionDTO>

type GovernanceMetadata = {
  chapter: Chapter
}

const governanceMetadata: GovernanceMetadata = {
  chapter: {
    id: '1',
    title: 'Chapter 1',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
    contains: [
      {
        id: 'identity-management',
        title: 'Identity Management',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
        number: '1',
        contains: [
          {
            id: 'identity-management-sub-section',
            title: 'Identity Management sub-section',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
            number: '1.1',
            contains: [
              {
                id: '1-1-1',
                title: 'Article 1',
                description:
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                number: '1.1.1',
                contains: [
                  {
                    id: '1-1-1-1',
                    title: 'Paragraph 1',
                    description:
                      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                    number: '1.1.1.1'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'datasets-management',
        title: 'Datasets Management',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
        number: '2',
        contains: [
          {
            id: 'reference-dataset',
            title: 'Reference dataset',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
            number: '2.1',
            contains: [
              {
                id: '2-1-1',
                title: 'Article 1',
                description:
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                number: '2.1.1',
                contains: [
                  {
                    id: '2-1-1-1',
                    title: 'Paragraph 1',
                    description:
                      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                    number: '2.1.1.1'
                  }
                ]
              }
            ]
          },
          {
            id: '2-2',
            title: 'Create metadata',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
            number: '2.2',
            contains: [
              {
                id: '2-2-1',
                title: 'Article 1',
                description:
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                number: '2.2.1',
                contains: [
                  {
                    id: '2-2-1-1',
                    title: 'Paragraph 1',
                    description:
                      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                    number: '2.2.1.1'
                  }
                ]
              }
            ]
          },
          {
            id: 'delete-metadata',
            title: 'Delete metadata',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
            number: '2.3',
            contains: [
              {
                id: '2-3-1',
                title: 'Article 1',
                description:
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                number: '2.3.1',
                contains: [
                  {
                    id: '2-3-1-1',
                    title: 'Paragraph 1',
                    description:
                      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                    number: '2.3.1.1'
                  }
                ]
              }
            ]
          },
          {
            id: 'dereference-metadata',
            title: 'Dereference metadata',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
            number: '2.4',
            contains: [
              {
                id: '2-4-1',
                title: 'Article 1',
                description:
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                number: '2.4.1',
                contains: [
                  {
                    id: '2-4-1-1',
                    title: 'Paragraph 1',
                    description:
                      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                    number: '2.4.1.1'
                  }
                ]
              }
            ]
          },
          {
            id: 'download-dataset',
            title: 'Download dataset',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
            number: '2.5',
            contains: [
              {
                id: '2-5-1',
                title: 'Article 1',
                description:
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                number: '2.5.1',
                contains: [
                  {
                    id: '2-5-1-1',
                    title: 'Paragraph 1',
                    description:
                      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                    number: '2.5.1.1'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: '3',
        title: 'Business Model',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
        number: '3',
        contains: [
          {
            id: 'dateset-retribution',
            title: 'Dateset retribution',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
            number: '3-1',
            contains: [
              {
                id: '3-1-1',
                title: 'Article 1',
                description:
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                number: '3.1.1',
                contains: [
                  {
                    id: '3-1-1-1',
                    title: 'Paragraph 1',
                    description:
                      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                    number: '3.1.1.1'
                  }
                ]
              }
            ]
          },
          {
            id: 'service-retribution',
            title: 'Service retribution',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
            number: '3.2',
            contains: [
              {
                id: '3-2-1',
                title: 'Article 1',
                description:
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                number: '3.2.1',
                contains: [
                  {
                    id: '3-2-1-1',
                    title: 'Paragraph 1',
                    description:
                      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                    number: '3.2.1.1'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}

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

  const sections = governanceMetadata.chapter.contains
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
