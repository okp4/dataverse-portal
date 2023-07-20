/* eslint-disable max-lines-per-function */
import { type FC, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useFileStore } from '@/ui/store'
import { type Item, List } from '@/ui/component/list/list'
import { Icon } from '@/ui/component/icon/icon'
import { KnowFee } from '@/ui/view/share/knowFee/knowFee'
import { Checkbox } from '@/ui/component/checkbox/checkbox'
import './summary.scss'

export const Summary: FC = () => {
  const { t } = useTranslation('share')
  const { files } = useFileStore(state => ({
    files: state.filesDescriptor
  }))

  const certificationStatement = t('share:share.dataset.summaryCertify')

  const [isChecked, setChecked] = useState<boolean>(false)

  const handleCheckedChange = useCallback(() => setChecked(s => !s), [])

  const items: Item[] = files()().map(({ id, name }) => ({
    content: <p>{name}</p>,
    id,
    key: id,
    leftElement: (
      <div>
        <Icon name="folder-outlined" />
      </div>
    )
  }))

  const formItems = useAppStore(state => state.shareData.form)
  const filteredformItems = formItems.filter(item => item.label !== 'fee')

  return (
    <div className="okp4-dataverse-portal-share-dataset-summary-container">
      <h2>{t('share:share.dataset.summary')}</h2>
      <div className="okp4-dataverse-portal-share-dataset-summary-left">
        <div className="okp4-dataverse-portal-share-dataset-summary-text-container">
          {filteredformItems.map(({ label, value }, index) => (
            <div className="okp4-dataverse-portal-share-dataset-summary-text" key={index}>
              <h3>{label.replace(/([A-Z])/g, ' $1')}</h3>
              <span>{value.toString()}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="okp4-dataverse-portal-share-dataset-summary-right">
        <List
          classes={{ main: 'okp4-dataverse-portal-share-dataset-summary-file-list' }}
          items={items}
        />
        <KnowFee label={t('share:share.dataset.knowFee')} readonly />
      </div>
      <p className="okp4-dataverse-portal-share-dataset-summary-certify">
        <Checkbox
          checked={isChecked}
          onCheckedChange={handleCheckedChange}
          value={certificationStatement}
        />
        <label htmlFor={certificationStatement}>{certificationStatement}</label>
      </p>
    </div>
  )
}
