import type { FC, ReactElement } from 'react'
import classNames from 'classnames'
import { useAppStore } from '@/ui/store'
import type { Field } from '@/ui/component/field/field'
import './knowFee.scss'

type KnowFeeProps = {
  label: string
  field: ReactElement<typeof Field>
}

export const KnowFee: FC<KnowFeeProps> = ({ field, label }) => {
  const theme = useAppStore(store => store.theme)

  return (
    <div className={classNames('okp4-dataverse-portal-share-data-know-fee-main', theme)}>
      <label className="okp4-dataverse-portal-share-data-know-fee-label">{label}</label>
      <div className="okp4-dataverse-portal-share-data-know-fee-field">{field}</div>
    </div>
  )
}
