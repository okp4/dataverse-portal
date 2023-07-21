/* eslint-disable max-lines-per-function */
import { type FC, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useFileStore, useAppStore } from '@/ui/store'
import { type Item, List } from '@/ui/component/list/list'
import { Icon } from '@/ui/component/icon/icon'
import { Checkbox } from '@/ui/component/checkbox/checkbox'
import './summary.scss'
import { Tag } from '@/ui/component/tag/tag'
import classNames from 'classnames'
import { Field } from '@/ui/component/field/field'
import { KnowFee } from '@/ui/view/share/knowFee/knowFee'

export const Summary: FC = () => {
  const { t } = useTranslation('share')

  const { files } = useFileStore(state => ({
    files: state.filesDescriptor
  }))

  const [isChecked, setChecked] = useState(false)
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

  const certifyText = t('share:share.dataset.summaryCertify')

  const formItems = useAppStore(state => state.shareData.form)
  const filteredformItems = formItems.filter(item => item.label !== 'fee')
  const tagItemsLabels: string[] = ['format', 'license', 'topic', 'geographicalCoverage', 'tags']
  const fee = formItems.find(item => item.label === 'fee')

  return (
    <div className="okp4-dataverse-portal-share-dataset-summary-container">
      <h2>{t('share:share.dataset.summary')}</h2>
      <div className="okp4-dataverse-portal-share-dataset-summary-left">
        <div className="okp4-dataverse-portal-share-dataset-summary-item-container">
          {filteredformItems.map(({ label, value }, index) => {
            return (
              <div className="okp4-dataverse-portal-share-dataset-summary-item" key={index}>
                <h3 className="okp4-dataverse-portal-share-dataset-summary-item-title">
                  {label.replace(/([A-Z])/g, ' $1')}
                </h3>
                {tagItemsLabels.includes(label) && Array.isArray(value) ? (
                  <div
                    className={classNames(
                      'okp4-dataverse-portal-share-dataset-summary-item-list',
                      `${label}-label`
                    )}
                  >
                    {[...new Set(value)].map(tag => (
                      <Tag key={tag} tagName={tag} />
                    ))}
                  </div>
                ) : (
                  <p className="okp4-dataverse-portal-share-dataset-summary-item-text">
                    {value.toString()}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="okp4-dataverse-portal-share-dataset-summary-right">
        <List
          classes={{ main: 'okp4-dataverse-portal-share-dataset-summary-file-list' }}
          items={items}
        />
        <KnowFee
          field={
            <Field
              id="know-fee"
              placeholder="0"
              readonly
              rightElement={<span>KNOW</span>}
              value={String(fee?.value ?? 0)}
            />
          }
        />
      </div>
      <p className="okp4-dataverse-portal-share-dataset-summary-certify">
        <Checkbox checked={isChecked} onCheckedChange={handleCheckedChange} value={certifyText} />
        <label htmlFor={certifyText}>{certifyText}</label>
      </p>
    </div>
  )
}
