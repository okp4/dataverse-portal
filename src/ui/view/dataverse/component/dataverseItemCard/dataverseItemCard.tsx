import React, { useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { Card } from '@/ui/component/card/card'
import type { DataverseItem } from '@/ui/types'
import './dataverseItemCard.scss'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { renderItemTypeColor } from '@/ui/common'

export type DataverseItemCardProps = {
  type: DataverseItem
  label: string
  topic: string
  button: JSX.Element
  className?: string
}

export const DataverseItemCard = React.forwardRef<HTMLDivElement, DataverseItemCardProps>(
  ({ type, label, topic, button, className }, ref) => {
    const { t } = useTranslation('common')

    const renderItemContent = useCallback(
      (label: string, topic: string): string => `### ${label}
${topic}`,
      []
    )

    return (
      <Card mainClassName={className}>
        <div className="okp4-dataverse-portal-dataverse-card-main" ref={ref}>
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
)

DataverseItemCard.displayName = 'DataverseItemCard'
