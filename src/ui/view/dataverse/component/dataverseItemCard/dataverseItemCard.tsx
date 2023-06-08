import type { FC } from 'react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Card } from '@/ui/component/card/card'
import type { DataverseItem } from '@/ui/types'
import { Button } from '@/ui/component/button/button'
import './dataverseItemCard.scss'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'


export type DataverseItemCardProps = {
  id: string
  type: DataverseItem
  label: string
  topic: string
}

export const DataverseItemCard: FC<DataverseItemCardProps> = ({ id, type, label, topic }) => {
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  type ColorVariant = 'primary-color' | 'primary-color-variant-3' | 'primary-color-variant-4'

  const renderItemTypeColor = useCallback((type: DataverseItem): ColorVariant => {
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
    (label: string, topic: string): string => `### ${label}
${topic}`,
    []
  )

  const handleDataverseItemDetails = useCallback((): void => {
    navigate(`/dataverse/${type}/${id}`)
  }, [id, navigate, type])

  return (
    <Card>
      <div className="okp4-dataverse-portal-dataverse-card-main">
        <div
          className={classNames(
            'okp4-dataverse-portal-dataverse-item-type',
            renderItemTypeColor(type)
          )}
        >
          {t(`resources.${type}`)}
        </div>
        <div className="okp4-dataverse-portal-dataverse-item-card-content">
          <div className="okp4-dataverse-portal-dataverse-topic">
            <ReactMarkdown>{renderItemContent(label, topic)}</ReactMarkdown>
          </div>
          <Button label={t('actions.details')} onClick={handleDataverseItemDetails} />
        </div>
      </div>
    </Card>
  )
}
