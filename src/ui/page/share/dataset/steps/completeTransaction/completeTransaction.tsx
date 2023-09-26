import type { FC } from 'react'
import * as O from 'fp-ts/Option'
import { flow, pipe } from 'fp-ts/lib/function'
import type { FormItem, TextField } from '@/ui/store/slice/shareData/shareData.slice'
import { Button } from '@/ui/component/button/button'
import { Icon } from '@/ui/component/icon/icon'
import { useAppStore } from '@/ui/store'
import './completeTransaction.scss'

// eslint-disable-next-line max-lines-per-function
export const CompleteTransaction: FC = () => {
  const theme = useAppStore(store => store.theme)

  const { formItems } = useAppStore(state => ({
    formItems: state.shareData.form
  }))

  const dataSetTitleField = formItems.find(item => item.type === 'text' && item.title === 'title')

  const getFieldValueForText = (item: TextField): string | undefined =>
    pipe(item.value, O.toUndefined)

  const isTextField = (item: FormItem): item is TextField => item.type === 'text'

  const dataSetTitle = pipe(
    dataSetTitleField,
    O.fromNullable,
    O.map(flow(O.fromPredicate(isTextField), O.map(getFieldValueForText), O.toUndefined)),
    O.toUndefined
  )

  return (
    <div className="okp4-dataverse-portal-share-dataset-complete-tx-container">
      <h2 className="okp4-dataverse-portal-share-dataset-complete-tx-title">
        Complete the transaction
      </h2>
      <div className="okp4-dataverse-portal-share-dataset-complete-tx-content">
        <div className="okp4-dataverse-portal-share-dataset-complete-tx-gradient" />
        <div className="okp4-dataverse-portal-share-dataset-complete-tx-content-summary-container">
          <span className="okp4-dataverse-portal-share-dataset-complete-tx-content-summary-type">
            Shared dataset
          </span>
          {dataSetTitle && (
            <h3 className="okp4-dataverse-portal-share-dataset-complete-tx-content-summary-title">
              {dataSetTitle}
            </h3>
          )}
          <div className="okp4-dataverse-portal-share-dataset-complete-tx-content-summary">
            <span className="okp4-dataverse-portal-share-dataset-complete-tx-fee-estimation">
              Fee estimation
            </span>
            <div className="okp4-dataverse-portal-share-dataset-complete-tx-fee">
              <div>
                <span className="okp4-dataverse-portal-share-dataset-complete-tx-fee-amount">
                  0,01
                </span>
                <span className="okp4-dataverse-portal-share-dataset-complete-tx-fee-currency">
                  KNOW
                </span>
              </div>
              <span className="okp4-dataverse-portal-share-dataset-complete-tx-fee-info-icon">
                <Icon name={`info-${theme}`} />
              </span>
            </div>
            <p className="okp4-dataverse-portal-share-dataset-complete-tx-fee-description">
              to reference your dataset into the protocol
            </p>
            <Button
              icons={{ endIcon: <Icon name="keplr" /> }}
              label={`Proceed to the payment on`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
