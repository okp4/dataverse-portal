import { useState, type FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as O from 'fp-ts/Option'
import { flow, pipe } from 'fp-ts/lib/function'
import { formatISODateToParts, localizedDateFormatter } from '@/util/date/date'
import type { FormItem, TextField } from '@/ui/store/slice/shareData/shareData.slice'
import { Button } from '@/ui/component/button/button'
import { Icon } from '@/ui/component/icon/icon'
import { useAppStore } from '@/ui/store'
import { Tooltip } from '@/ui/component/tooltip/tooltip'
import { LottieLoader } from '@/ui/component/loader/lottieLoader'
import potion from '@/ui/asset/animations/potion.json'
import './completeTransaction.scss'

type SummaryProps = {
  onButtonClick: () => void
}

// eslint-disable-next-line max-lines-per-function
const Summary: FC<SummaryProps> = ({ onButtonClick }) => {
  const { t, i18n } = useTranslation('share')
  const locale = i18n.language

  const theme = useAppStore(store => store.theme)

  const { defaultFee, coinDenom } = APP_ENV.chains[0].feeCurrencies[0]

  return (
    <>
      <span className="okp4-dataverse-portal-share-dataset-complete-tx-fee-estimation">
        {t('share.completeTransaction.feeEstimation')}
      </span>
      <div className="okp4-dataverse-portal-share-dataset-complete-tx-fee">
        <div>
          <span className="okp4-dataverse-portal-share-dataset-complete-tx-fee-amount">
            {defaultFee.toLocaleString(locale) /* TODO: replace with real fee*/}
          </span>
          <span className="okp4-dataverse-portal-share-dataset-complete-tx-fee-currency">
            {coinDenom}
          </span>
        </div>
        <span className="okp4-dataverse-portal-share-dataset-complete-tx-fee-info-icon">
          <Tooltip
            align="start"
            alignOffset={-35}
            content={
              <>
                <p>
                  <span>{t('share.completeTransaction.tooltip.gasFeeOnly')}</span>&nbsp;
                  <span>{t('share.completeTransaction.tooltip.estimationNote')}</span>
                </p>
                <div>
                  <p>{t('share.completeTransaction.tooltip.pleaseNote')}</p>
                  <ul>
                    <li>{t('share.completeTransaction.tooltip.gasFeePurpose')}</li>
                    <li>{t('share.completeTransaction.tooltip.transactionDeclineCondition')}</li>
                    <li>{t('share.completeTransaction.tooltip.exactGasFee')}</li>
                  </ul>
                </div>
                <p>{t('share.completeTransaction.tooltip.maxProcessingTime')}</p>
                <p>{t('share.completeTransaction.tooltip.chooseGasPriceCarefully')}</p>
              </>
            }
            contentClassName="okp4-dataverse-portal-share-dataset-complete-tx-fee-info-tooltip"
            trigger={<Icon name={`info-outlined-${theme}`} />}
          />
        </span>
      </div>
      <p className="okp4-dataverse-portal-share-dataset-complete-tx-fee-description">
        {t('share.completeTransaction.referenceDataset')}
      </p>
      <Button
        icons={{ endIcon: <Icon name="keplr" /> }}
        label={t('share.completeTransaction.proceedPayment')}
        onClick={onButtonClick}
      />
    </>
  )
}

// eslint-disable-next-line max-lines-per-function
const ValidationSummary: FC = () => {
  const { t } = useTranslation('share')

  const formatter = useMemo(
    () =>
      localizedDateFormatter(
        {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        },
        'en-US'
      ),
    []
  )

  const isoDate = new Date().toISOString() // TODO: replace with isoDate from tx

  const dateTimeParts = formatISODateToParts(formatter, isoDate)

  const { month, day, year, hour, minute } = Object.fromEntries(
    dateTimeParts.map(({ type, value }) => [type, value])
  )

  return (
    <div className="okp4-dataverse-portal-share-dataset-complete-tx-content-validation-summary">
      <div className="okp4-dataverse-portal-share-dataset-complete-tx-content-validation-summary-potion">
        <LottieLoader animationData={potion} />
      </div>
      <span className="okp4-dataverse-portal-share-dataset-complete-tx-time">
        {`${month}/${day}/${year} ${hour}:${minute}`}
      </span>
      <h3 className="okp4-dataverse-portal-share-dataset-complete-tx-validation-title">
        {t('share.completeTransaction.paymentSuccessfullyValidated')}
      </h3>
      <p className="okp4-dataverse-portal-share-dataset-complete-tx-validation-description">
        {t('share.completeTransaction.yourDatasetReferencingRequestHasBeenSent')}
      </p>
      <a
        className="okp4-dataverse-portal-share-dataset-complete-tx-validation-link"
        href={APP_ENV.urls['explorer:okp4']} // TODO: update with id of tx
        rel="noreferrer"
        target="_blank"
      >
        {t('share.completeTransaction.openTransactionExplorer')}
      </a>
    </div>
  )
}

// eslint-disable-next-line max-lines-per-function
export const CompleteTransaction: FC = () => {
  const [paymentValidated, setPaymentValidated] = useState(false)

  const { t } = useTranslation('share')

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

  const handleButtonClick = useCallback(() => {
    setPaymentValidated(true)
  }, [])

  return (
    <div className="okp4-dataverse-portal-share-dataset-complete-tx-container">
      <h2 className="okp4-dataverse-portal-share-dataset-complete-tx-title">
        {t('share.completeTransaction.completeTransaction')}
      </h2>
      <div className="okp4-dataverse-portal-share-dataset-complete-tx-content">
        <div className="okp4-dataverse-portal-share-dataset-complete-tx-gradient" />
        <div className="okp4-dataverse-portal-share-dataset-complete-tx-content-container">
          <span className="okp4-dataverse-portal-share-dataset-complete-tx-content-type">
            {t('share.completeTransaction.sharedDataset')}
          </span>
          {dataSetTitle && (
            <h3 className="okp4-dataverse-portal-share-dataset-complete-tx-content-title">
              {dataSetTitle}
            </h3>
          )}
          <div className="okp4-dataverse-portal-share-dataset-complete-tx-content-summary">
            {paymentValidated ? (
              <ValidationSummary />
            ) : (
              <Summary onButtonClick={handleButtonClick} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
