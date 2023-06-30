import type { FC } from 'react'
import { useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import type { Zone } from '@/ui/page/dataverse/dataverse'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import { isZone } from '@/ui/page/dataverse/zone/zone'
import { BackButton } from '@/ui/view/dataverse/component/backButton/backButton'
import { GovernanceDetails } from '@/ui/view/governance/details/details'
import { NotFoundError } from '@/ui/page/error/notFoundError/notFoundError'
import { mockedGovernanceChapter } from './mockedData'
import { GovernanceNavigation } from './governanceNavigation'
import './governance.scss'

// eslint-disable-next-line max-lines-per-function
export const Governance: FC = () => {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const {
    id: zoneId,
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
    const governanceBasePath = `/dataverse/zone/${zoneId}/governance`
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
  }, [zoneId, sectionIdParams, subsectionIdParams, currentSection, currentSubsection, sections])

  const zoneLabel = useMemo(
    () =>
      pipe(
        O.fromNullable(zoneId),
        O.flatMap(getResourceDetails),
        O.filter(isZone),
        O.map((zone: Zone) => zone.label),
        O.toNullable
      ),
    [zoneId]
  )

  useEffect(() => {
    if (navigationPath) {
      return navigate(navigationPath, { replace: true })
    }
  }, [navigate, navigationPath])

  if (!zoneLabel || !navigationPath) {
    return <NotFoundError />
  }

  if (!zoneId || !currentSection || !currentSubsection) return null

  return (
    <div className="okp4-dataverse-portal-governance-page-main">
      <div className="okp4-dataverse-portal-governance-page-back-button">
        <BackButton to={`/dataverse/zone/${zoneId}`} />
      </div>
      <section className="okp4-dataverse-portal-governance-page-section">
        <h1>{`${zoneLabel} | ${t('resources.governance')}`}</h1>
        <GovernanceNavigation
          activeSectionId={currentSection.id}
          sections={sections}
          zoneId={zoneId}
        />
        <GovernanceDetails section={currentSection} subSection={currentSubsection} />
      </section>
    </div>
  )
}
