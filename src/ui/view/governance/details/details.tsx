import { useCallback, useState } from 'react'
import type { FC } from 'react'
import { Icon } from '@/ui/component/icon/icon'
import type { IconName } from '@/ui/component/icon/icon'
import { useAppStore } from '@/ui/store/appStore'
import './details.scss'
import { fakeData } from './fakeData'
import type { ArticleDTO, SubSectionDTO, ParagraphDTO } from './types'

type ArticleProps = {
  article: ArticleDTO
  isOnlyArticle: boolean
}

type SubSectionProps = {
  subSection: SubSectionDTO
}

type ParagraphProps = {
  paragraph: ParagraphDTO
  theme: string
}
const renderIcon = (category: string, theme: string): JSX.Element => {
  const iconMapping: Record<string, string> = {
    'Verification method': 'key',
    Topic: 'shapes',
    Size: 'computer',
    'Geographical Coverage': 'earth',
    Authorship: 'user',
    Metadata: 'description',
    Licence: 'shield',
    Users: 'users'
  }

  return <Icon name={`${iconMapping[category]}-${theme}` as IconName} />
}


const Paragraph: FC<ParagraphProps> = ({ paragraph }) => (
  <div className="okp4-dataverse-portal-governance-details-paragraph">
    <h3 className="okp4-dataverse-portal-governance-details-paragraph-title">{paragraph.title}</h3>
    <p className="okp4-dataverse-portal-governance-details-description paragraph">
      {paragraph.description}
    </p>
  </div>
)

const Article: FC<ArticleProps> = ({ article, isOnlyArticle }) => {
  const theme = useAppStore(store => store.theme)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const toggleArticle = useCallback(() => setIsOpen(!isOpen), [isOpen])

  return (
    <div className="okp4-dataverse-portal-governance-details-article-container">
      <div className="okp4-dataverse-portal-governance-details-article-header">
        <div className="okp4-dataverse-portal-governance-details-article-header-left-part">
          <h3 className="okp4-dataverse-portal-governance-details-article-title">
            {article.title}
          </h3>
          {isOpen && article.description && (
            <p className="okp4-dataverse-portal-governance-details-description article">
              {article.description}
            </p>
          )}
        </div>
        {!isOnlyArticle && (
          <div className="okp4-dataverse-portal-governance-details-article-header-right-part">
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
        <div className="okp4-dataverse-portal-governance-details-header-part">
          <h2 className="okp4-dataverse-portal-governance-details-title">{foundSection.title}</h2>
          {foundSection.description && (
            <p className="okp4-dataverse-portal-governance-details-description">
              {foundSection.description}
            </p>
          )}
        </div>
        <div className="okp4-dataverse-portal-governance-details-header-part">
          <h2 className="okp4-dataverse-portal-governance-details-title subsection">
            {foundSubSection.title}
          </h2>
          {foundSection.description && (
            <p className="okp4-dataverse-portal-governance-details-description subsection">
              {foundSubSection.description}
            </p>
          )}
        </div>
      </div>
      <div className="okp4-dataverse-portal-governance-details-subsection-container">
        <SubSection subSection={foundSubSection} />
      </div>
    </div>
  ) : (
    <p>Not found</p>
  )
}
