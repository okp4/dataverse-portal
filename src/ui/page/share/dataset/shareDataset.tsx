import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ServiceStorageSelection } from './steps/serviceStorageSelection/serviceStorageSelection'
import { DataSelection } from './steps/dataSelection/dataSelection'
import { MetadataFilling } from './steps/metadataFilling/metadataFilling'
import { Stepper } from '@/ui/component/stepper/stepper'
import type { StepElement } from '@/ui/component/stepper/stepper'
import { useAppStore } from '@/ui/store'
import type { DatePickerValue, FormItem } from '@/ui/store/slice/shareData/shareData.slice'
import '../i18n/index'
import './shareDataset.scss'

const isFormItemFilled = (item: FormItem): boolean => {
  switch (item.type) {
    case 'text': {
      return !!(item.value as unknown as string)
    }
    case 'select': {
      return !!(item.value as unknown as string[]).length
    }
    case 'numeric': {
      const numericField = item.value as unknown as number
      return numericField === 0 || !!numericField
    }
    case 'date': {
      const datePickerField = item.value as unknown as DatePickerValue
      return !!datePickerField.from || !!datePickerField.to
    }
  }
}

export const ShareDataset: FC = () => {
  const { t } = useTranslation('share')
  const { form } = useAppStore(state => ({
    form: state.shareData.form
  }))

  const validateMetadataFillingStep = (): boolean => {
    const requiredFields = form.filter(el => el.required)
    return requiredFields.every(isFormItemFilled)
  }

  const storageServiceSelection: StepElement = { id: 'step1', content: <ServiceStorageSelection /> }
  const dataSelection: StepElement = { id: 'step2', content: <DataSelection /> }
  const metadataFilling: StepElement = {
    id: 'step3',
    content: <MetadataFilling />,
    onValidate: validateMetadataFillingStep
  }

  const steps = [storageServiceSelection, dataSelection, metadataFilling]

  return (
    <div className="okp4-dataverse-portal-share-dataset-page-main">
      <h1>{t('share.dataset.title')}</h1>
      <Stepper steps={steps} />
    </div>
  )
}
