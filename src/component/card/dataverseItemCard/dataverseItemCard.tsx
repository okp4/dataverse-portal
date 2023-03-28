import type { FC } from 'react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import './DataverseItemCard.scss'
import { Card } from '@/component/card/card'
import { Button } from '@/component/button/button'
import { Tag } from '@/component/tag/tag'
import ReactMarkdown from 'react-markdown'
import type { ColorVariant } from '@/component/tag/tag'

type DataverseItem = 'dataspace' | 'dataset' | 'service'

export type DataverseItemCardProps = {
  id: string
  type: DataverseItem
  label: string
  description: string
}

export const DataverseItemCard: FC<DataverseItemCardProps> = ({ id, type, label, description }) => {
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  const renderTagColor = useCallback((type: DataverseItem): ColorVariant => {
    switch (type) {
      case 'service':
        return 'primary-color'
      case 'dataspace':
        return 'primary-color-variant-3'
      case 'dataset':
        return 'primary-color-variant-4'
    }
  }, [])

  const renderItemContent = useCallback(
    (label: string, description: string): string => `### ${label}
${description}`,
    []
  )

  const handleDataverseItemDetails = useCallback((): void => {
    navigate(`/dataverse/${type}/${id}`)
  }, [id, navigate, type])

  return (
    <Card>
      <div className="okp4-dataverse-portal-dataverse-item-card-main">
        <Tag colorVariant={renderTagColor(type)} label={t(`resources.${type}`)} />
        <div className="okp4-dataverse-portal-dataverse-item-card-content">
          <div className="okp4-dataverse-portal-dataverse-description">
            <ReactMarkdown>{renderItemContent(label, description)}</ReactMarkdown>
          </div>
          <Button label={t('actions.details')} onClick={handleDataverseItemDetails} />
        </div>
      </div>
    </Card>
  )
}
