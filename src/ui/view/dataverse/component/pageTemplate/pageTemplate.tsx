import { useCallback } from 'react'
import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/Array'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import { Tags } from '@/ui/view/dataverse/component/tags/tags'
import type { ItemGeneralMetadata } from '@/ui/view/dataverse/types'
import { GeneralMetadataList } from '@/ui/view/dataverse/component/generalMetadata/generalMetadata'
import './pageTemplate.scss'
import { GovernanceDescription } from '@/ui/view/dataverse/component/governanceDescription/governanceDescription'
import { isDataSpace } from '@/ui/page/dataverse/dataspace/dataspace'
import { Icon } from '@/ui/component/icon/icon'

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
  const navigate = useNavigate()
  const backToDataverse = useCallback((): void => navigate('/dataverse'), [navigate])
  const tags = pipe(
    metadata,
    A.filter(isTagsMetadata),
    A.chain(metadata => metadata.value)
  )

  const generalMetadata = pipe(metadata, A.filter(isGeneralMetadata))

  return (
    <div className="okp4-dataverse-portal-dataverse-component-page-template-main">
      <div className="okp4-dataverse-portal-dataverse-page-template-left-side-wrapper">
        <div className="okp4-dataverse-portal-dataverse-button" onClick={backToDataverse}>
          <Icon name="arrow-left" />
        </div>
        {data.label}
        {tags.length > 0 && <Tags tags={tags} />}
        <GeneralMetadataList metadata={generalMetadata} />
        {isDataSpace(data) && <GovernanceDescription description={data.governance.description} />}
      </div>
    </div>
  )
}

export default PageTemplate
