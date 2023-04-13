import { useCallback } from 'react'
import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/Array'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import type { ItemGeneralMetadata } from '@/ui/view/dataverse/types'
import { GeneralMetadataList } from '@/ui/view/dataverse/component/generalMetadata/generalMetadata'
import ItemOverview from '@/ui/view/dataverse/component/itemOverview/itemOverview'
import { GovernanceDescription } from '@/ui/view/dataverse/component/governanceDescription/governanceDescription'
import { Icon } from '@/ui/component/icon/icon'
import { isDataSpace } from '@/ui/page/dataverse/dataspace/dataspace'
import { DataverseItemStatCard } from '@/ui/view/dataverse/component/dataverseItemStatCard/dataverseItemStatCard'
import './pageTemplate.scss'
import './i18n/index'
import { SummaryMetadata } from '@/ui/view/dataverse/component/summaryMetadata/summaryMetadata'

type PageTemplateProps = {
  data: DataverseItemDetails
  metadata: ItemGeneralMetadata[]
}

const propertiesWithIcon = [
  'category',
  'topic',
  'format',
  'license',
  'geographicalCoverage',
  'temporalCoverage'
] as const

type PropertyWithIcon = (typeof propertiesWithIcon)[number]

const isPropertyWithIcon = (prop: string): prop is PropertyWithIcon =>
  propertiesWithIcon.includes(prop as PropertyWithIcon)

const isTagsMetadata = (
  metadata: ItemGeneralMetadata
): metadata is Omit<ItemGeneralMetadata, 'value'> & { property: 'tags'; value: string[] } =>
  metadata.property === 'tags'

const isGeneralMetadataWithIcon = (
  metadata: ItemGeneralMetadata
): metadata is Omit<ItemGeneralMetadata, 'value'> & { value: string } =>
  metadata.property !== 'tags' &&
  metadata.category === 'generalMetadata' &&
  isPropertyWithIcon(metadata.property)

const tags = (metadata: ItemGeneralMetadata[]): string[] =>
  pipe(
    metadata,
    A.filter(isTagsMetadata),
    A.chain(metadata => metadata.value)
  )

const PageTemplate: FC<PageTemplateProps> = ({ data, metadata }): JSX.Element => {
  const { t } = useTranslation(['pageTemplate', 'common'])
  const navigate = useNavigate()
  const backToDataverse = useCallback((): void => navigate('/dataverse'), [navigate])

  const generalMetadataWithIcon = pipe(metadata, A.filter(isGeneralMetadataWithIcon))

  return (
    <div className="okp4-dataverse-portal-dataverse-component-page-template-main">
      <div className="okp4-dataverse-portal-dataverse-back">
        <button className="okp4-dataverse-portal-dataverse-back-button" onClick={backToDataverse}>
          <Icon name="arrow-left" />
        </button>
        <span className="okp4-dataverse-portal-dataverse-back-text">{t('dataverse')}</span>
      </div>
      <div className="okp4-dataverse-portal-dataverse-page-template-left-side-wrapper">
        <ItemOverview
          description={data.description}
          tags={tags(metadata)}
          title={data.label}
          type={data.type}
        />
        <GeneralMetadataList metadata={generalMetadataWithIcon} />
        <SummaryMetadata metadata={metadata} />
        {isDataSpace(data) && <GovernanceDescription description={data.governance.description} />}
      </div>
      <div className="okp4-dataverse-portal-dataverse-page-template-right-side-wrapper">
        {isDataSpace(data) && (
          <>
            <h2>{t('inDataspace')}</h2>
            <div className="okp4-dataverse-portal-dataverse-page-template-dataverse-item-stat-cards">
              {data.resources.map(({ type, amount, lastUpdated }) => (
                <DataverseItemStatCard
                  amount={amount}
                  key={type}
                  lastUpdated={lastUpdated}
                  type={type}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PageTemplate
