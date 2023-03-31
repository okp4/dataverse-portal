import type { FC } from 'react'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import Tags from '@/ui/view/dataverse/component/tags/tags'
import { NavToPrevious } from '@/ui/view/navToPrevious'
import './pageTemplate.scss'

type PageTemplateProps = {
  data: DataverseItemDetails
}

const PageTemplate: FC<PageTemplateProps> = ({ data }): JSX.Element => (
  <div className="okp4-dataverse-portal-dataverse-component-page-template-main">
    <div className="okp4-dataverse-portal-dataverse-page-template-left-side-wrapper">
      <NavToPrevious />
      {data.tags && <Tags tags={data.tags} />}
    </div>
  </div>
)

export default PageTemplate
