import type { FC } from 'react'
import { useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import type { DataSpace } from '@/ui/page/dataverse/dataverse'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import { isDataSpace } from '@/ui/page/dataverse/dataspace/dataspace'
import { mockedGovernanceChapter } from './mockedData'
import { GovernanceNavigation } from './governanceNavigation'
import { BackButton } from '@/ui/view/dataverse/component/backButton/backButton'
import { GovernanceDetails } from '@/ui/view/governance/details/details'
import { NotFoundError } from '@/ui/page/notFoundError/notFoundError'
import './governance.scss'

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
        O.flatMap(getResourceDetails),
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
    return <NotFoundError />
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
          activeSectionId={currentSection.id}
          dataspaceId={dataspaceId}
          sections={sections}
        />
        <GovernanceDetails section={currentSection} subSection={currentSubsection} />
      </section>
    </div>
  )
}
