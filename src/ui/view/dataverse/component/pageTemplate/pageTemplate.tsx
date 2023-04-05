import type { FC } from 'react'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/Array'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import { Tags } from '@/ui/view/dataverse/component/tags/tags'
import type { ItemGeneralMetadata } from '@/ui/view/dataverse/types'
import { GeneralMetadataList } from '@/ui/view/dataverse/component/generalMetadata/generalMetadata'
import './pageTemplate.scss'

type PageTemplateProps = {
  data: DataverseItemDetails
  metadata: ItemGeneralMetadata[]
}

const isTagsMetadata = (
  metadata: ItemGeneralMetadata
): metadata is Omit<ItemGeneralMetadata, 'value'> & { property: 'tags'; value: string[] } =>
  metadata.property === 'tags'

const isGeneralMetadata = (
  metadata: ItemGeneralMetadata
): metadata is Omit<ItemGeneralMetadata, 'value'> & { value: string } =>
  metadata.property !== 'tags'

const PageTemplate: FC<PageTemplateProps> = ({ data, metadata }): JSX.Element => {
  const tags = pipe(
    metadata,
    A.filter(isTagsMetadata),
    A.chain(metadata => metadata.value)
  )

  const generalMetadata = pipe(metadata, A.filter(isGeneralMetadata))

  return (
    <div className="okp4-dataverse-portal-dataverse-component-page-template-main">
      <div className="okp4-dataverse-portal-dataverse-page-template-left-side-wrapper">
        {data.label}
        {tags.length > 0 && <Tags tags={tags} />}
        <GeneralMetadataList metadata={generalMetadata} />
      </div>
    </div>
  )
}

export default PageTemplate
