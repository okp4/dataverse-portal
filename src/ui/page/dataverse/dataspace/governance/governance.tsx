import type { FC } from 'react'
import { useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/Option'
import type { DataSpace } from '@/ui/page/dataverse/dataverse'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import { isDataSpace } from '@/ui/page/dataverse/dataspace/dataspace'
import { GovernanceContent } from './governanceContent'
import { mockedGovernanceChapter } from './mockedData'
import './governance.scss'

// eslint-disable-next-line max-lines-per-function
export const Governance: FC = () => {
  const navigate = useNavigate()
  const {
    id: dataspaceId,
    sectionId: sectionIdParams,
    subsectionId: subsectionIdParams
  } = useParams<string>()

  const sections = mockedGovernanceChapter.contains
  const currentSection = sections.find(section => section.id === sectionIdParams)
  const currentSubsection = currentSection?.contains.find(
    subsection => subsection.id === subsectionIdParams
  )

  const navigationPath = useMemo((): string | undefined => {
    const governanceBasePath = `/dataverse/dataspace/${dataspaceId}/governance`
    const firstSection = sections[0]
    const firstSubsection = firstSection.contains[0]

    if (!sectionIdParams && !subsectionIdParams) {
      return `${governanceBasePath}/${firstSection.id}/${firstSubsection.id}`
    }

    if (sectionIdParams && subsectionIdParams && currentSection && currentSubsection) {
      return `${governanceBasePath}/${currentSection.id}/${currentSubsection.id}`
    }

    if (sectionIdParams && !subsectionIdParams && currentSection) {
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
    navigate('/404')
  }, [navigate, navigationPath])

  if (!dataspaceLabel) {
    return <p>dataspace not found</p>
  }

  if (!dataspaceId) return null

  return (
    <GovernanceContent
      activeSection={currentSection}
      activeSubsection={currentSubsection}
      dataspaceId={dataspaceId}
      label={dataspaceLabel}
      sections={sections}
    />
  )
}
