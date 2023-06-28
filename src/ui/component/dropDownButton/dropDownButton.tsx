import { useCallback, useMemo, useState } from 'react'
import type { FC } from 'react'
import { Collapsible } from '@/ui/component/collapsible/collapsible'
import { Button } from '@/ui/component/button/button'
import type { NonEmptyArray } from '@/util/type'
import classNames from 'classnames'
import './dropDownButton.scss'

type Icons = {
  startIcon?: JSX.Element
  endIcon?: JSX.Element
}

export type Option = {
  label: string
  onClick: () => void
  icons?: Icons
}

type DropDownButtonProps = {
  label: string
  options: NonEmptyArray<Option>
  variant?: 'primary' | 'secondary'
}

export const DropDownButton: FC<DropDownButtonProps> = ({
  label,
  options,
  variant = 'secondary'
}) => {
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const labelParagraph = useMemo(() => <p>{label}</p>, [label])

  const handleButtonClick = useCallback(
    (callback: () => void) => () => {
      setIsOpened(false)
      callback()
    },
    []
  )

  const content = useMemo(
    () => (
      <>
        {options.map(({ label, onClick, icons }, index) => (
          <div
            className="okp4-dataverse-portal-drop-down-button-content-button-wrapper"
            key={index}
          >
            <Button
              className="okp4-dataverse-portal-drop-down-button-content-button"
              icons={icons}
              label={label}
              onClick={handleButtonClick(onClick)}
              variant={`${variant}-discreet`}
            />
          </div>
        ))}
      </>
    ),
    [handleButtonClick, options, variant]
  )

  return (
    <Collapsible
      content={content}
      contentClassName={classNames('okp4-dataverse-portal-drop-down-button-content', variant)}
      onOpenChange={setIsOpened}
      open={isOpened}
      rootClassName={classNames('okp4-dataverse-portal-drop-down-button-main', variant)}
      trigger={labelParagraph}
      triggerClassName="okp4-dataverse-portal-drop-down-button-label"
    />
  )
}
