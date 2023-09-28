import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as O from 'fp-ts/Option'
import { flow, pipe } from 'fp-ts/lib/function'
import type { FormItem, TextField } from '@/ui/store/slice/shareData/shareData.slice'
import { Button } from '@/ui/component/button/button'
import { Icon } from '@/ui/component/icon/icon'
import { useAppStore } from '@/ui/store'
import './completeTransaction.scss'

// eslint-disable-next-line max-lines-per-function
export const CompleteTransaction: FC = () => {
  const { t, i18n } = useTranslation('share')
  const locale = i18n.language

  const theme = useAppStore(store => store.theme)

  const { formItemById } = useAppStore(state => ({
    formItemById: state.shareData.formItemById
  }))

  const dataSetTitleField = pipe('input-field-1', formItemById)()

  const getFieldValueForText = (item: TextField): string | undefined =>
    pipe(item.value, O.toUndefined)

  const isTextField = (item: FormItem): item is TextField => item.type === 'text'

  const dataSetTitle = pipe(
    dataSetTitleField,
    O.map(flow(O.fromPredicate(isTextField), O.map(getFieldValueForText), O.toUndefined)),
    O.toUndefined
  )

  return (
    <div className="okp4-dataverse-portal-share-dataset-complete-tx-container">
      <h2 className="okp4-dataverse-portal-share-dataset-complete-tx-title">
        {t('share.completeTransaction.completeTransaction')}
      </h2>
      <div className="okp4-dataverse-portal-share-dataset-complete-tx-content">
        <div className="okp4-dataverse-portal-share-dataset-complete-tx-gradient" />
        <div className="okp4-dataverse-portal-share-dataset-complete-tx-content-summary-container">
          <span className="okp4-dataverse-portal-share-dataset-complete-tx-content-summary-type">
            {t('share.completeTransaction.sharedDataset')}
          </span>
          {dataSetTitle && (
            <h3 className="okp4-dataverse-portal-share-dataset-complete-tx-content-summary-title">
              {dataSetTitle}
            </h3>
          )}
          <div className="okp4-dataverse-portal-share-dataset-complete-tx-content-summary">
            <span className="okp4-dataverse-portal-share-dataset-complete-tx-fee-estimation">
              {t('share.completeTransaction.feeEstimation')}
            </span>
            <div className="okp4-dataverse-portal-share-dataset-complete-tx-fee">
              <div>
                <span className="okp4-dataverse-portal-share-dataset-complete-tx-fee-amount">
                  {
                    APP_ENV.chains[0].feeCurrencies[0].defaultFee.toLocaleString(locale) // TODO: replace with real fee
                  }
                </span>
                <span className="okp4-dataverse-portal-share-dataset-complete-tx-fee-currency">
                  {APP_ENV.chains[0].feeCurrencies[0].coinDenom}
                </span>
              </div>
              <span className="okp4-dataverse-portal-share-dataset-complete-tx-fee-info-icon">
                <Icon name={`info-outlined-${theme}`} />
              </span>
            </div>
            <p className="okp4-dataverse-portal-share-dataset-complete-tx-fee-description">
              {t('share.completeTransaction.referenceDataset')}
            </p>
            <Button
              icons={{ endIcon: <Icon name="keplr" /> }}
              label={t('share.completeTransaction.proceedPayment')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
