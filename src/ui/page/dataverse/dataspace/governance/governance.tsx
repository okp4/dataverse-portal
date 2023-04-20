import type { FC } from 'react'
import { useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import type { DataSpace } from '@/ui/page/dataverse/dataverse'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import { isDataSpace } from '@/ui/page/dataverse/dataspace/dataspace'
import type { SectionDTO } from './mockedData'
import { mockedGovernanceChapter } from './mockedData'
import './governance.scss'
import { GovernanceNavigation } from './governanceNavigation'
import { useTranslation } from 'react-i18next'
import { BackButton } from '@/ui/view/dataverse/component/backButton/backButton'

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

// eslint-disable-next-line max-lines-per-function
export const Governance: FC = () => {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const {
    id: dataspaceId,
    sectionId: sectionIdParams,
    subsectionId: subsectionIdParams
  } = useParams<string>()

  const sections = useMemo(() => mockedGovernanceChapter.contains, [])
  const currentSection = useMemo(
    () => sections.find(section => section.id === sectionIdParams),
    [sectionIdParams, sections]
  )
  const currentSubsection = useMemo(
    () => currentSection?.contains.find(subsection => subsection.id === subsectionIdParams),
    [subsectionIdParams, currentSection]
  )

  const navigationPath = useMemo((): string | undefined => {
    const governanceBasePath = `/dataverse/dataspace/${dataspaceId}/governance`
    const firstSection = sections[0]
    const firstSubsection = firstSection.contains[0]

    if (!sectionIdParams && !subsectionIdParams) {
      return `${governanceBasePath}/${firstSection.id}/${firstSubsection.id}`
    }

    if (currentSection && currentSubsection) {
      return `${governanceBasePath}/${currentSection.id}/${currentSubsection.id}`
    }

    if (!subsectionIdParams && currentSection) {
      return `${governanceBasePath}/${currentSection.id}/${currentSection.contains[0].id}`
    }
  }, [
    dataspaceId,
    sectionIdParams,
    subsectionIdParams,
    currentSection,
    currentSubsection,
    sections
  ])

  const dataspaceLabel = useMemo(
    () =>
      pipe(
        O.fromNullable(dataspaceId),
        O.chain(getResourceDetails),
        O.filter(isDataSpace),
        O.map((dataspace: DataSpace) => dataspace.label),
        O.toNullable
      ),
    [dataspaceId]
  )

  useEffect(() => {
    if (navigationPath) {
      return navigate(navigationPath, { replace: true })
    }
  }, [navigate, navigationPath])

  if (!dataspaceLabel || !navigationPath) {
    return <p>dataspace not found</p>
  }

  if (!dataspaceId || !currentSection || !currentSubsection) return null

  return (
    <div className="okp4-dataverse-portal-governance-page-main">
      <div className="okp4-dataverse-portal-governance-page-back-button">
        <BackButton to={`/dataverse/dataspace/${dataspaceId}`} />
      </div>
      <section className="okp4-dataverse-portal-governance-page-section">
        <h1>{`${dataspaceLabel} | ${t('resources.governance')}`}</h1>
        <GovernanceNavigation
          dataspaceId={dataspaceId}
          sectionId={currentSection.id}
          sections={sections}
          subsectionId={currentSubsection.id}
        />
        <Section section={currentSection} />
      </section>
    </div>
  )
}
