import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ServiceReferenceSelection } from './steps/serviceReferenceSelection/serviceReferenceSelection'
import { Stepper } from '@/ui/component/stepper/stepper'
import './shareService.scss'
import '../i18n/index'

export const ShareService: FC = () => {
  const { t } = useTranslation('share')

  const referenceServiceSelection = {
    id: 'step1',
    content: <ServiceReferenceSelection />
  }

  const steps = [referenceServiceSelection]

  return (
    <div className="okp4-dataverse-portal-share-service-page-main">
      <h1 className="okp4-dataverse-portal-share-service-page-main-title">
        {t('share.service.title')}
      </h1>
      <Stepper steps={steps} />
    </div>
  )
}
