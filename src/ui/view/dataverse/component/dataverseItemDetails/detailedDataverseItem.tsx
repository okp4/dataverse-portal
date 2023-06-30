import type { FC } from 'react'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/Array'
import classNames from 'classnames'
import { isZone } from '@/ui/page/dataverse/zone/zone'
import { GeneralMetadataList } from '@/ui/view/dataverse/component/generalMetadata/generalMetadata'
import { GovernanceDescription } from '@/ui/view/dataverse/component/governanceDescription/governanceDescription'
import { SummaryMetadata } from '@/ui/view/dataverse/component/summaryMetadata/summaryMetadata'
import ItemOverview from '@/ui/view/dataverse/component/itemOverview/itemOverview'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import type { ItemGeneralMetadata } from '@/ui/view/dataverse/types'
import './detailedDataverseItem.scss'

type DetailedDataverseItemProps = {
  data: DataverseItemDetails
  metadata: ItemGeneralMetadata[]
  className?: string
  onClose?: () => void
}

const propertiesWithIcon = [
  'category',
  'topic',
  'format',
  'license',
  'geographicalCoverage',
  'period'
] as const

type PropertyWithIcon = (typeof propertiesWithIcon)[number]

const isPropertyWithIcon = (prop: string): prop is PropertyWithIcon =>
  propertiesWithIcon.includes(prop as PropertyWithIcon)

const isTagsMetadata = (
  metadata: ItemGeneralMetadata
): metadata is Omit<ItemGeneralMetadata, 'value'> & { property: 'tags'; value: string[] } =>
  metadata.property === 'tags'

const tags = (metadata: ItemGeneralMetadata[]): string[] =>
  pipe(
    metadata,
    A.filter(isTagsMetadata),
    A.flatMap(metadata => metadata.value)
  )

export const isGeneralMetadataWithIcon = (
  metadata: ItemGeneralMetadata
): metadata is Omit<ItemGeneralMetadata, 'value'> & { value: string } =>
  metadata.category === 'generalMetadata' && isPropertyWithIcon(metadata.property)

export const DetailedDataverseItem: FC<DetailedDataverseItemProps> = ({
  data,
  metadata,
  className,
  onClose
}) => {
  const generalMetadataWithIcon = pipe(metadata, A.filter(isGeneralMetadataWithIcon))

  return (
    <div className={classNames('okp4-dataverse-portal-dataverse-item-details', className)}>
      <ItemOverview
        description={data.description}
        onClose={onClose}
        tags={tags(metadata)}
        title={data.label}
      />
      <GeneralMetadataList metadata={generalMetadataWithIcon} />
      <SummaryMetadata metadata={metadata} />
      {isZone(data) && <GovernanceDescription description={data.governance.description} />}
    </div>
  )
}
