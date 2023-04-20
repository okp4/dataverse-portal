import { useCallback, useMemo, useRef, useState } from 'react'
import type { FC } from 'react'
import { Icon } from '@/ui/component/icon/icon'
import type { IconName } from '@/ui/component/icon/icon'
import { useAppStore } from '@/ui/store/appStore'
import { Button } from '@/ui/component/button/button'
import type {
  ArticleDTO,
  SubSectionDTO,
  ParagraphDTO,
  SectionDTO
} from '@/ui/page/dataverse/dataspace/governance/mockedData'

import './details.scss'

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

type GovernanceDetailsProps = {
  section: SectionDTO
  subSection: SubSectionDTO
}

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

const Paragraph: FC<ParagraphProps> = ({ paragraph, theme }) => {
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const isTextTooLong = useMemo(
    () =>
      paragraphRef.current && paragraphRef.current.offsetHeight < paragraphRef.current.scrollHeight,
    [paragraphRef.current]
  )

  return (
    <div className="okp4-dataverse-portal-governance-details-paragraph-container">
      <div className="okp4-dataverse-portal-governance-details-paragraph">
        <Icon name={`${iconMapping[paragraph.title] || 'description'}-${theme}` as IconName} />
        <h3 className="okp4-dataverse-portal-governance-details-paragraph-title">
          {paragraph.title}
        </h3>
        <p
          className="okp4-dataverse-portal-governance-details-description paragraph"
          ref={paragraphRef}
        >
          {paragraph.description}
        </p>
        {isTextTooLong && (
          <div className="okp4-dataverse-portal-governance-details-button">
            <Button disabled label="See more" variant="outlined-tertiary" />
          </div>
        )}
      </div>
    </div>
  )
}

const Article: FC<ArticleProps> = ({ article, isOnlyArticle }) => {
  const theme = useAppStore(store => store.theme)
  const isFirstArticle = article.number.endsWith('1')
  const [isOpen, setIsOpen] = useState<boolean>(isFirstArticle)

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

      {isOpen && article.contains.length > 0 && (
        <div className="okp4-dataverse-portal-governance-details-paragraphs-container">
          {article.contains.map(paragraph => (
            <Paragraph key={paragraph.id} paragraph={paragraph} theme={theme} />
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

export const GovernanceDetails: FC<GovernanceDetailsProps> = ({ section, subSection }) => (
  <div className="okp4-dataverse-portal-governance-governance-details-main">
    <div className="okp4-dataverse-portal-governance-details-header">
      <div className="okp4-dataverse-portal-governance-details-header-part">
        <h2 className="okp4-dataverse-portal-governance-details-title">{section.title}</h2>
        {section.description && (
          <p className="okp4-dataverse-portal-governance-details-description">
            {section.description}
          </p>
        )}
      </div>
      <div className="okp4-dataverse-portal-governance-details-header-part">
        <h2 className="okp4-dataverse-portal-governance-details-title subsection">
          {subSection.title}
        </h2>
        {subSection.description && (
          <p className="okp4-dataverse-portal-governance-details-description subsection">
            {subSection.description}
          </p>
        )}
      </div>
    </div>
    <div className="okp4-dataverse-portal-governance-details-subsection-container">
      <SubSection subSection={subSection} />
    </div>
  </div>
)
