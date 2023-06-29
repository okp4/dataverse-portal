import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ServiceStorageSelection } from './steps/serviceStorageSelection/serviceStorageSelection'
import { Stepper } from '@/ui/component/stepper/stepper'
import type { StepElement } from '@/ui/component/stepper/stepper'
import '../i18n/index'
import './shareDataset.scss'

export const ShareDataset: FC = () => {
  const { t } = useTranslation('share')

  const storageServiceSelection: StepElement = { id: 'step1', content: <ServiceStorageSelection /> }
  const dataSelection: StepElement = { id: 'step2', content: <h1>Step 2</h1> }

  const steps = [storageServiceSelection, dataSelection]

  return (
    <div className="okp4-dataverse-portal-share-dataset-page-main">
      <h1>{t('share.dataset.title')}</h1>
      <Stepper steps={steps} />
    </div>
  )
}
