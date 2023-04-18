/* eslint-disable max-lines-per-function */
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useParams, Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import type { Option } from 'fp-ts/Option'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/lib/function'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import { isDataSpace } from '@/ui/page/dataverse/dataspace/dataspace'
import { BackButton } from '@/ui/view/dataverse/component/backButton/backButton'
import { GovernanceNavigation } from './governanceNavigation'
import './governance.scss'

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

type SubSectionDTO = DescriptedDTOWithNumber & Container<ArticleDTO>

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
  const [dataverseItem, setDataverseItem] = useState<Option<DataverseItemDetails>>(O.none)

  useEffect(() => {
    pipe(O.fromNullable(id), O.chain(getResourceDetails), O.filter(isDataSpace), setDataverseItem)
  }, [id])

  const sections = governanceMetadata.chapter.contains
  const firstSection = sections[0]
  const firstSectionId = firstSection.id
  const firstSubsection = firstSection.contains[0]
  const firstSubsectionId = firstSubsection.id

  const currentSection = sections.find(section => section.id === sectionIdParams)
  const currentSubsection = currentSection?.contains.find(
    subsection => subsection.id === subsectionIdParams
  )

  useEffect(() => {
    if (!currentSection && !currentSubsection) {
      navigate(`${firstSectionId}/${firstSubsectionId}`)
    }
    if (currentSection && !currentSubsection) {
      navigate(`${currentSection.id}/${currentSection.contains[0].id}`)
    }
  }, [navigate, firstSectionId, firstSubsectionId, currentSection, currentSubsection])

  return O.match(
    () => <p>dataverse item not found</p>,
    (dataverseItem: DataverseItemDetails) => {
      const { label } = dataverseItem
      // TODO: add governance translation for title
      return (
        <div className="okp4-dataverse-portal-governance-page-main">
          <div className="okp4-dataverse-portal-governance-page-back-button">
            {/* id should be imbedded in the argument object */}
            <BackButton to={`/dataverse/dataspace/${id}`} />
          </div>
          <section className="okp4-dataverse-portal-governance-page-section">
            <h1>{`${label} | governance`}</h1>
            <GovernanceNavigation
              activeSectionId={currentSection?.id}
              activeSubsectionId={currentSubsection?.id}
              sections={sections}
            />
            <Outlet context={currentSection} />
          </section>
        </div>
      )
    }
  )(dataverseItem)
}
