import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import type { ItemGeneralMetadata } from '@/ui/view/dataverse/types'
import { BackButton } from '@/ui/view/dataverse/component/backButton/backButton'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import { DetailedDataverseItem } from '@/ui/view/dataverse/component/dataverseItemDetails/detailedDataverseItem'
import { renderItemTypeColor } from '@/ui/common'
import { isZone } from '@/ui/page/dataverse/zone/zone'
import { GovernanceDescription } from '@/ui/view/dataverse/component/governanceDescription/governanceDescription'
import './pageTemplate.scss'

type PageTemplateProps = {
  data: DataverseItemDetails
  metadata: ItemGeneralMetadata[]
}

const PageTemplate: FC<PageTemplateProps> = ({ data, metadata }) => {
  const { t } = useTranslation('common')

  return (
    <div className="okp4-dataverse-portal-dataverse-component-page-template-main">
      <BackButton label={t('dataverse')} to="/dataverse" />
      <div className="okp4-dataverse-portal-dataverse-page-template-left-side-wrapper">
        <h3
          className={classNames(
            'okp4-dataverse-portal-dataverse-item-overview-type',
            renderItemTypeColor(data.type)
          )}
        >
          {t(`resources.${data.type}`)}
        </h3>
        <DetailedDataverseItem data={data} metadata={metadata} />
      </div>
      <div className="okp4-dataverse-portal-dataverse-page-template-right-side-wrapper">
        {isZone(data) && <GovernanceDescription description={data.governance.description} />}
      </div>
    </div>
  )
}

export default PageTemplate
