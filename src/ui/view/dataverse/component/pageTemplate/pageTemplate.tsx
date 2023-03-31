import type { FC } from 'react'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import { Tags } from '@/ui/view/dataverse/component/tags/tags'
import type { MetadataProperty } from '@/ui/view/dataverse/component/generalMetadata/generalMetadata'
import { GeneralMetadataList } from '@/ui/view/dataverse/component/generalMetadata/generalMetadata'
import './pageTemplate.scss'

type PageTemplateProps = {
  data: DataverseItemDetails
  tags: string[]
  metadata: MetadataProperty[]
}

const PageTemplate: FC<PageTemplateProps> = ({ data, tags, metadata }): JSX.Element => (
  <div className="okp4-dataverse-portal-dataverse-component-page-template-main">
    <div className="okp4-dataverse-portal-dataverse-page-template-left-side-wrapper">
      {data.label}
      {tags.length > 0 && <Tags tags={tags} />}
      <GeneralMetadataList metadata={metadata} />
    </div>
  </div>
)

export default PageTemplate
