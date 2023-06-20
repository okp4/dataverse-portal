import { useMemo } from 'react'
import type { FC } from 'react'
import { Collapsible } from '@/ui/component/collapsible/collapsible'
import classNames from 'classnames'
import './dropDownButton.scss'

type Icons = {
  startIcon?: JSX.Element
}

export type Option = {
  label: string
  onClick: () => void
  icons?: Icons
}

type ButtonProps = Option
type DropDownButtonProps = {
  label: string
  options: [Option, ...Option[]]
  variant?: 'primary' | 'secondary'
}

const Button: FC<ButtonProps> = ({ label, onClick, icons }): JSX.Element => (
  <button className="okp4-dataverse-portal-drop-down-button-option-button" onClick={onClick}>
    {icons?.startIcon}
    {label}
  </button>
)

export const DropDownButton: FC<DropDownButtonProps> = ({
  label,
  options,
  variant = 'secondary'
}) => {
  const labelParagraph = useMemo(() => <p>{label}</p>, [label])
  const content = useMemo(
    () => (
      <>
        {options.map(({ label, onClick, icons }, index) => (
          <Button icons={icons} key={index} label={label} onClick={onClick} />
        ))}
      </>
    ),
    [options]
  )

  return (
    <Collapsible
      content={content}
      contentClassName={classNames('okp4-dataverse-portal-drop-down-button-content', variant)}
      rootClassName={classNames('okp4-dataverse-portal-drop-down-button-main', variant)}
      trigger={labelParagraph}
      triggerClassName="okp4-dataverse-portal-drop-down-button-label"
    />
  )
}
