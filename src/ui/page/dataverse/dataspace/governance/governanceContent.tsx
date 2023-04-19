import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Option } from 'fp-ts/Option'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/lib/function'
import type { DataSpace } from '@/ui/page/dataverse/dataverse'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import { isDataSpace } from '@/ui/page/dataverse/dataspace/dataspace'
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
  sections: SectionDTO[]
  dataspaceId: string
  activeSection?: SectionDTO
  activeSubsection?: SubSectionDTO
}

export const GovernanceContent: FC<GovernanceContentProps> = ({
  dataspaceId,
  activeSection,
  activeSubsection,
  sections
}) => {
  const { t } = useTranslation('common')
  const [dataspace, setDataspace] = useState<Option<DataSpace>>(O.none)

  useEffect(() => {
    pipe(
      O.fromNullable(dataspaceId),
      O.chain(getResourceDetails),
      O.filter(isDataSpace),
      setDataspace
    )
  }, [dataspaceId])

  return O.match(
    () => <p>dataverse item not found</p>,
    ({ label }: DataSpace) => {
      return (
        <div className="okp4-dataverse-portal-governance-page-main">
          <div className="okp4-dataverse-portal-governance-page-back-button">
            <BackButton to={`/dataverse/dataspace/${dataspaceId}`} />
          </div>
          <section className="okp4-dataverse-portal-governance-page-section">
            <h1>{`${label} | ${t('resources.governance')}`}</h1>
            <GovernanceNavigation
              activeSectionId={activeSection?.id}
              activeSubsectionId={activeSubsection?.id}
              dataspaceId={dataspaceId}
              sections={sections}
            />
            <Section section={activeSection ?? sections[0]} />
          </section>
        </div>
      )
    }
  )(dataspace)
}
