import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../component/icon/icon'
import './navToPrevious.scss'

export const NavToPrevious = (): JSX.Element => {
  const navigate = useNavigate()
  const handlePreviousPage = useCallback((): void => navigate(-1), [navigate])

  return (
    <div className="okp4-dataverse-portal-previous-button-main" onClick={handlePreviousPage}>
      <Icon name="arrow-left" />
    </div>
  )
}
