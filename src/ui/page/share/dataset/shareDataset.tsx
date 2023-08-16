import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
// import * as O from 'fp-ts/Option'
// import { ServiceStorageSelection } from './steps/serviceStorageSelection/serviceStorageSelection'
// import { DataSelection } from './steps/dataSelection/dataSelection'
import { MetadataFilling } from './steps/metadataFilling/metadataFilling'
import { Stepper } from '@/ui/component/stepper/stepper'
import type { StepElement } from '@/ui/component/stepper/stepper'
import '../i18n/index'
import './shareDataset.scss'
// import { useAppStore, useFileStore } from '@/ui/store'

export const ShareDataset: FC = () => {
  const { t } = useTranslation('share')
  // const { storageServiceId } = useAppStore(store => ({
  //   storageServiceId: store.shareData.storageServiceId
  // }))
  // const { hasStoredFiles } = useFileStore(store => ({
  //   hasStoredFiles: store.hasStoredFiles
  // }))

  // const storageServiceSelection: StepElement = {
  //   id: 'step1',
  //   content: <ServiceStorageSelection />,
  //   validate: () => O.isSome(storageServiceId)
  // }
  // const dataSelection: StepElement = {
  //   id: 'step2',
  //   content: <DataSelection />,
  //   validate: () => hasStoredFiles()()
  // }
  const metadataFilling: StepElement = { id: 'step3', content: <MetadataFilling /> }

  const steps = [metadataFilling]

  return (
    <div className="okp4-dataverse-portal-share-dataset-page-main">
      <h1>{t('share.dataset.title')}</h1>
      <Stepper steps={steps} />
    </div>
  )
}
