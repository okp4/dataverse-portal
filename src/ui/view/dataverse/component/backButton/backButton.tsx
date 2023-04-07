import type { FC } from 'react'
import { useCallback } from 'react'
import { Icon } from '@/ui/component/icon/icon'
import { useNavigate } from 'react-router-dom'
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
      <button className="okp4-dataverse-portal-back-button" onClick={handleRouting}>
        <Icon name="arrow-left" />
      </button>
      {label && <span className="okp4-dataverse-portal-back-text">{label}</span>}
    </div>
  )
}
