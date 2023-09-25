import type { FC } from 'react'
import { Button } from '@/ui/component/button/button'
import { Icon } from '@/ui/component/icon/icon'
import { useAppStore } from '@/ui/store'
import './completeTransaction.scss'

export const CompleteTransaction: FC = () => {
  const theme = useAppStore(store => store.theme)
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
          <h3 className="okp4-dataverse-portal-share-dataset-complete-tx-content-summary-title">
            Name of the dataset
          </h3>
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
