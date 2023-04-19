import type { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BackButton } from '@/ui/view/dataverse/component/backButton/backButton'
import { GovernanceNavigation } from './governanceNavigation'
import type { SectionDTO, SubSectionDTO } from './mockedData'
import './governance.scss'

type SectionProps = {
  section: SectionDTO
}

export const Section: FC<SectionProps> = ({ section }) => {
  const { subsectionId } = useParams<{ subsectionId: string }>()
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

type GovernanceContentProps = {
  label: string
  sections: SectionDTO[]
  dataspaceId: string
  activeSection?: SectionDTO
  activeSubsection?: SubSectionDTO
}

export const GovernanceContent: FC<GovernanceContentProps> = ({
  label,
  dataspaceId,
  activeSection,
  activeSubsection,
  sections
}) => {
  const { t } = useTranslation('common')

  return (
    <div className="okp4-dataverse-portal-governance-page-main">
      <div className="okp4-dataverse-portal-governance-page-back-button">
        <BackButton to={`/dataverse/dataspace/${dataspaceId}`} />
      </div>
      <section className="okp4-dataverse-portal-governance-page-section">
        <h1>{`${label} | ${t('resources.governance')}`}</h1>
        <GovernanceNavigation
          dataspaceId={dataspaceId}
          sectionId={activeSection?.id}
          sections={sections}
          subsectionId={activeSubsection?.id}
        />
        <Section section={activeSection ?? sections[0]} />
      </section>
    </div>
  )
}
