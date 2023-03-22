import type { FC } from 'react'
import { useCallback } from 'react'
import './dataverseCard.scss'
import { Card } from '@/component/card/card'
import { Button } from '@/component/button/button'
import { Tag } from '@/component/tag/tag'
import ReactMarkdown from 'react-markdown'
import type { ColorVariant } from '@/component/tag/tag'
import { useTranslation } from 'react-i18next'

type DataverseItem = 'dataspace' | 'dataset' | 'service'

export type DataverseCardProps = {
  type: DataverseItem
  label: string
  description: string
}

export const DataverseCard: FC<DataverseCardProps> = ({ type, label, description }) => {
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

  return (
    <Card>
      <div className="okp4-dataverse-portal-dataverse-card-main">
        <Tag colorVariant={renderTagColor(type)} label={t(`data.${type}`)} />
        <div className="okp4-dataverse-portal-dataverse-card-content">
          <div className="okp4-dataverse-portal-dataverse-description">
            <ReactMarkdown>{renderItemContent(label, description)}</ReactMarkdown>
          </div>
          <Button disabled label={t('actions.details')} variant="primary" />
        </div>
      </div>
    </Card>
  )
}
