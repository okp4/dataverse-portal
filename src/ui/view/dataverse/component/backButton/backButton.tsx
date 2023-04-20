import type { FC } from 'react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/ui/component/icon/icon'
import { Button } from '@/ui/component/button/button'
import './backButton.scss'

type BackButtonProps = {
  to: string
  label?: string
}

export const BackButton: FC<BackButtonProps> = ({ to, label }): JSX.Element => {
  const navigate = useNavigate()

  const handleRouting = useCallback(() => {
    navigate(to)
  }, [navigate, to])

  return (
    <div className="okp4-dataverse-portal-back-main">
      <Button
        className="okp4-dataverse-portal-back-button"
        iconButtonOnly={<Icon name="arrow-left" />}
        onClick={handleRouting}
        variant="outlined-tertiary"
      />
      {label && <p className="okp4-dataverse-portal-back-text">{label}</p>}
    </div>
  )
}
