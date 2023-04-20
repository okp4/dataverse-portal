import type { FC } from 'react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { activeLanguageWithDefault } from '@/ui/languages/languages'
import type { InternationalizedDescription } from '@/ui/page/dataverse/dataverse'
import { Button } from '@/ui/component/button/button'
import { Icon } from '@/ui/component/icon/icon'
import { Card } from '@/ui/component/card/card'
import './governanceDescription.scss'

type GovernanceDescriptionProps = {
  description: InternationalizedDescription
}

export const GovernanceDescription: FC<GovernanceDescriptionProps> = ({
  description
}): JSX.Element => {
  const { t } = useTranslation('common')
  const navigate = useNavigate()

  const internationalizedDescription = useCallback((): string => {
    const { lng } = activeLanguageWithDefault()
    return description[lng as keyof InternationalizedDescription]
  }, [description])

  const handleButtonClick = useCallback(() => {
    navigate('./governance')
  }, [navigate])

  return (
    <Card mainClassName="okp4-dataverse-portal-data-space-governance-description-main">
      <div className="okp4-dataverse-portal-data-space-governance-description-container">
        <h2 className="okp4-dataverse-portal-data-space-governance-description-title">
          {t('resources.governance')}
        </h2>
        <p className="okp4-dataverse-portal-data-space-governance-description-description">
          {internationalizedDescription()}
        </p>
        <Button
          icons={{ endIcon: <Icon name="arrow-right" /> }}
          label={t('actions.accessGovernance')}
          onClick={handleButtonClick}
          size="large"
        />
      </div>
    </Card>
  )
}
