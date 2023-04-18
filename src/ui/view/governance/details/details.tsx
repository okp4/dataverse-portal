import { useCallback, useState } from 'react'
import type { FC } from 'react'
import { Icon } from '@/ui/component/icon/icon'
import type { IconName } from '@/ui/component/icon/icon'
import { useAppStore } from '@/ui/store/appStore'
import './details.scss'

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

type DescriptedDTOWithNumber = DescriptedDTO & Numbered

type Container<T> = {
  contains: T[]
}

type ParagraphDTO = DescriptedDTOWithNumber

type ArticleDTO = DescriptedDTOWithNumber & Container<ParagraphDTO>

type SubSectionDTO = DescriptedDTOWithNumber & Container<ArticleDTO>

type SectionDTO = DescriptedDTOWithNumber & Container<SubSectionDTO>

type Chapter = DescriptedDTO & Container<SectionDTO>

type ArticleProps = {
  article: ArticleDTO
  isOnlyArticle: boolean
}

type SubSectionProps = {
  subSection: SubSectionDTO
}

type ParagraphProps = {
  paragraph: ParagraphDTO
}

const fakeData: Chapter = {
  id: 'chapter1',
  title: 'Chapter 1',
  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
  contains: [
    {
      id: 'section1',
      title: 'Section 1',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
      number: '1',
      contains: [
        {
          id: 'subsection1',
          title: 'Subsection 1',
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
          number: '1.1',
          contains: [
            {
              title: 'Article 1',
              id: 'article1',
              description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
              number: '1.1.1',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Paragraph 1',
                  description:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                  number: '1.1.1.1'
                },
                {
                  id: 'paragraph2',
                  title: 'Paragraph 2',
                  description:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                  number: '1.1.1.2'
                },
                {
                  id: 'paragraph3',
                  title: 'Paragraph 3',
                  description:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                  number: '1.1.1.3'
                },
                {
                  id: 'paragraph4',
                  title: 'Paragraph 4',
                  description:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                  number: '1.1.1.4'
                },
                {
                  id: 'paragraph5',
                  title: 'Paragraph 5',
                  description:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                  number: '1.1.1.5'
                },
                {
                  id: 'paragraph6',
                  title: 'Paragraph 6',
                  description:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                  number: '1.1.1.6'
                },
                {
                  id: 'paragraph7',
                  title: 'Paragraph 7',
                  description:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                  number: '1.1.1.7'
                }
              ]
            },
            {
              title: 'Article 2',
              id: 'article2',
              description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
              number: '1.1.2',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Paragraph 1',
                  description:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                  number: '1.1.2.1'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'section2',
      title: 'Section 2',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
      number: '2',
      contains: [
        {
          id: 'subsection1',
          title: 'Subsection 1',
          description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
          number: '2.1',
          contains: [
            {
              title: 'Article 1',
              id: 'article1',
              description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
              number: '2.1.1',
              contains: [
                {
                  id: 'paragraph1',
                  title: 'Paragraph 1',
                  description:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
                  number: '2.1.1.1'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

const Paragraph: FC<ParagraphProps> = ({ paragraph }) => (
  <div className="okp4-dataverse-portal-governance-details-paragraph">
    <h3 className="okp4-dataverse-portal-governance-details-paragraph-title">{paragraph.title}</h3>
    <h4 className="okp4-dataverse-portal-governance-details-paragraph-description">
      {paragraph.description}
    </h4>
  </div>
)

const Article: FC<ArticleProps> = ({ article, isOnlyArticle }) => {
  const theme = useAppStore(store => store.theme)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const toggleArticle = useCallback(() => setIsOpen(!isOpen), [isOpen])

  return (
    <div className="okp4-dataverse-portal-governance-details-article-container">
      <div className="okp4-dataverse-portal-governance-details-article-header">
        <h3 className="okp4-dataverse-portal-governance-details-article-title">{article.title}</h3>
        {!isOnlyArticle && (
          <div className="okp4-dataverse-portal-governance-details-article-title-right-part">
            <div className="okp4-dataverse-portal-governance-details-article-paragraphs-number">
              {article.contains.length}
            </div>
            <div
              className={`okp4-dataverse-portal-governance-details-article-expand-button ${
                isOpen ? 'rotate-down' : 'rotate-up'
              }`}
              onClick={toggleArticle}
            >
              <Icon name={`arrow-down-${theme}` as IconName} />
            </div>
          </div>
        )}
      </div>

      {(isOnlyArticle || isOpen) && (
        <div className="okp4-dataverse-portal-governance-details-paragraphs-container">
          {article.contains.map(paragraph => (
            <Paragraph key={paragraph.id} paragraph={paragraph} />
          ))}
        </div>
      )}
    </div>
  )
}

const SubSection: FC<SubSectionProps> = ({ subSection }) => (
  <div className="okp4-dataverse-portal-governance-details-subsection-content">
    {subSection.contains.map(article => (
      <Article
        article={article}
        isOnlyArticle={subSection.contains.length === 1}
        key={article.number}
      />
    ))}
  </div>
)

export const GovernanceDetails: FC = () => {
  const sectionId = 'section1'
  const subSectionId = 'subsection1'

  const foundSection = fakeData.contains.find(data => data.id === sectionId)
  const foundSubSection = foundSection?.contains.find(data => data.id === subSectionId)
  const foundGovernance = foundSection && foundSubSection

  return foundGovernance ? (
    <div className="okp4-dataverse-portal-governance-governance-details-main">
      <div className="okp4-dataverse-portal-governance-details-header">
        <h2 className="okp4-dataverse-portal-governance-details-section-title">
          {foundSection.title}
        </h2>
        <h3 className="okp4-dataverse-portal-governance-details-subsection-title">
          {foundSubSection.title}
        </h3>
      </div>
      <div className="okp4-dataverse-portal-governance-details-subsection-container">
        <SubSection subSection={foundSubSection} />
      </div>
    </div>
  ) : (
    <p>Not found</p>
  )
}
