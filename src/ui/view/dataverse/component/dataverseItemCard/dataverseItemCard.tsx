import type { FC } from 'react'
import { useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { Card } from '@/ui/component/card/card'
import type { DataverseItem } from '@/ui/types'
import './dataverseItemCard.scss'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

export type DataverseItemCardProps = {
  type: DataverseItem
  label: string
  topic: string
  button: JSX.Element
}

export const DataverseItemCard: FC<DataverseItemCardProps> = ({ type, label, topic, button }) => {
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
          {button}
        </div>
      </div>
    </Card>
  )
}
