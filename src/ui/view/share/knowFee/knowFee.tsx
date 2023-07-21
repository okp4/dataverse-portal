import type { FC, ReactElement } from 'react'
import classNames from 'classnames'
import { useAppStore } from '@/ui/store'
import type { Field } from '@/ui/component/field/field'
import './knowFee.scss'
import { useTranslation } from 'react-i18next'

type KnowFeeProps = {
  field: ReactElement<typeof Field>
}

export const KnowFee: FC<KnowFeeProps> = ({ field }) => {
  const { t } = useTranslation('share')

  const theme = useAppStore(store => store.theme)

  return (
    <div className={classNames('okp4-dataverse-portal-share-data-know-fee-main', theme)}>
      <label className="okp4-dataverse-portal-share-data-know-fee-label">
        {t('share:share.dataset.knowFee')}
      </label>
      <div className="okp4-dataverse-portal-share-data-know-fee-field">{field}</div>
    </div>
  )
}
