import type { FC } from 'react'
import classNames from 'classnames'
import { useAppStore } from '@/ui/store'
import { Field } from '@/ui/component/field/field'
import './knowFee.scss'

type KnowFeeProps = {
  readonly?: boolean
  label: string
}

export const KnowFee: FC<KnowFeeProps> = ({ readonly = false, label }) => {
  const theme = useAppStore(store => store.theme)

  const formItems = useAppStore(state => state.shareData.form)
  const fee = formItems.find(item => item.label === 'fee')

  return (
    <div className={classNames('okp4-dataverse-portal-share-data-know-fee-main', theme)}>
      <p>{label}</p>
      <div className="okp4-dataverse-portal-share-data-know-fee-field">
        <Field
          id="know-fee"
          placeholder="0"
          readonly={readonly}
          rightElement={<span>KNOW</span>}
          value={String(fee?.value ?? 0)}
        />
      </div>
    </div>
  )
}
