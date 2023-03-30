
import type { FC } from 'react'
import type { DataverseItemDetails } from '@/page/dataverse/dataverse'
import Tags from '../tags/tags'
import DataverseDescription from '../description/description'
import './pageTemplate.scss'

type PageTemplateProps = {
  data: DataverseItemDetails
}

const PageTemplate: FC<PageTemplateProps> = ({ data }): JSX.Element => (
  <div className='okp4-dataverse-portal-dataverse-component-page-template-main' >
    <div className='okp4-dataverse-portal-dataverse-page-template-left-side-wrapper'>
      <DataverseDescription label={data.label} text={data.description} type={data.type} />
      {data.tags && <Tags tags={data.tags} />}
    </div>
  </div>
)

export default PageTemplate

