/* eslint-disable max-lines-per-function */
import { type FC, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/lib/function'
import { useFileStore, useAppStore } from '@/ui/store'
import { type Item, List } from '@/ui/component/list/list'
import { Icon } from '@/ui/component/icon/icon'
import { Checkbox } from '@/ui/component/checkbox/checkbox'
import { Tag } from '@/ui/component/tag/tag'
import { KnowFee } from '@/ui/view/share/knowFee/knowFee'
import { NumericField } from '@/ui/component/field/numericField'
import type {
  FormItem,
  NumericField as NumericFieldType,
  SelectPicker,
  TagField,
  TextField
} from '@/ui/store/slice/shareData/shareData.slice'
import './summary.scss'

export const Summary: FC = () => {
  const { t } = useTranslation(['common', 'share'])

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

  const { formItems } = useAppStore(state => ({
    formItems: state.shareData.form
  }))
  const summaryLeftfItems = formItems.filter(item => item.type !== 'numeric')
  const feeItem = formItems.find(item => item.type === 'numeric') as NumericFieldType | undefined

  const getFieldValueForTagOrSelect = (item: TagField | SelectPicker): string[] | undefined =>
    pipe(item.value, O.toUndefined)

  const getFieldValueForText = (item: TextField): string | undefined =>
    pipe(item.value, O.toUndefined)

  const getFieldValueForNumeric = (item: NumericFieldType): number | undefined =>
    pipe(item.value, O.toUndefined)

  type SummaryLeftItemProps = {
    item: FormItem
  }

  const SummaryLeftItem: FC<SummaryLeftItemProps> = ({ item }) => {
    const { type } = item
    switch (type) {
      case 'tag':
      case 'select': {
        const fieldValue = getFieldValueForTagOrSelect(item)
        if (fieldValue) {
          return (
            <div
              className={classNames(
                'okp4-dataverse-portal-share-dataset-summary-item-list',
                `${type}-label`
              )}
            >
              {fieldValue.map(tag => (
                <Tag key={tag} tagName={tag} />
              ))}
            </div>
          )
        }
        return null
      }
      case 'text': {
        const textValue = getFieldValueForText(item)
        if (textValue) {
          return (
            <p className="okp4-dataverse-portal-share-dataset-summary-item-text">{textValue}</p>
          )
        }

        return null
      }
      case 'numeric':
      case 'i18n-text':
        return null
    }
  }

  return (
    <div className="okp4-dataverse-portal-share-dataset-summary-container">
      <h2 className="okp4-dataverse-portal-share-dataset-summary-title">
        {t('share:share.dataset.summary')}
      </h2>
      <div className="okp4-dataverse-portal-share-dataset-summary-left">
        <div className="okp4-dataverse-portal-share-dataset-summary-item-container">
          {summaryLeftfItems.map((item, index) => (
            <div
              className={classNames('okp4-dataverse-portal-share-dataset-summary-item')}
              key={index}
            >
              <h3 className="okp4-dataverse-portal-share-dataset-summary-item-title">
                {item.title}
              </h3>
              <SummaryLeftItem item={item} />
            </div>
          ))}
        </div>
      </div>
      <div className="okp4-dataverse-portal-share-dataset-summary-right">
        <List
          classes={{
            main: 'okp4-dataverse-portal-share-dataset-summary-file-list',
            container: 'okp4-dataverse-portal-share-dataset-summary-file-list-container'
          }}
          items={items}
        />
        {feeItem && (
          <KnowFee
            field={
              <NumericField
                decimalPseudoSeparators={[',']}
                decimalSeparator="."
                id="know-fee"
                max={Infinity}
                min={0}
                placeholder="0"
                precision={APP_ENV.chains[0].feeCurrencies[0].coinDecimals}
                readOnly
                rightElement={<span>{APP_ENV.chains[0].currencies[0].coinDenom}</span>}
                thousandSeparator=" " // narrow no-break space U+202F
                value={getFieldValueForNumeric(feeItem)}
              />
            }
            label={t('share:share.dataset.knowFee')}
          />
        )}
      </div>
      <p className="okp4-dataverse-portal-share-dataset-summary-certify">
        <Checkbox checked={isChecked} onCheckedChange={handleCheckedChange} value={certifyText} />
        <label htmlFor={certifyText}>{certifyText}</label>
      </p>
    </div>
  )
}
