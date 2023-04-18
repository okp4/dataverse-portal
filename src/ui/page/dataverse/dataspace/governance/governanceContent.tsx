import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useParams, Outlet, useOutletContext } from 'react-router-dom'
import type { Option } from 'fp-ts/Option'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/lib/function'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import { isDataSpace } from '@/ui/page/dataverse/dataspace/dataspace'
import { BackButton } from '@/ui/view/dataverse/component/backButton/backButton'
import { GovernanceNavigation } from './governanceNavigation'
import type { SectionDTO, SubSectionDTO } from './governance'
import './governance.scss'

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

type GovernanceContentProps = {
  activeSection?: SectionDTO
  activeSubsection?: SubSectionDTO
  id?: string
  sections: SectionDTO[]
}

export const GovernanceContent: FC<GovernanceContentProps> = ({
  id,
  activeSection,
  activeSubsection,
  sections
}) => {
  const [dataverseItem, setDataverseItem] = useState<Option<DataverseItemDetails>>(O.none)

  useEffect(() => {
    pipe(O.fromNullable(id), O.chain(getResourceDetails), O.filter(isDataSpace), setDataverseItem)
  }, [id])

  return O.match(
    () => <p>dataverse item not found</p>,
    ({ label }: DataverseItemDetails) => (
      <div className="okp4-dataverse-portal-governance-page-main">
        <div className="okp4-dataverse-portal-governance-page-back-button">
          {/* id should be imbedded in the argument object */}
          <BackButton to={`/dataverse/dataspace/${id}`} />
        </div>
        <section className="okp4-dataverse-portal-governance-page-section">
          <h1>{`${label} | governance`}</h1>
          <GovernanceNavigation
            activeSectionId={activeSection?.id}
            activeSubsectionId={activeSubsection?.id}
            sections={sections}
          />
          <Outlet context={activeSection} />
        </section>
      </div>
    )
  )(dataverseItem)
}
