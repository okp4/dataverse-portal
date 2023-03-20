import { useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import { Button } from '@/component/button/button'
import { Card } from '@/component/card/card'
import Tag from '@/component/tag/tag'
import type { ColorVariant } from '@/component/tag/tag'
import './dataverse.scss'

type DataverseItem = 'dataspace' | 'dataset' | 'service'

type DataverseItemDetails = {
  type: DataverseItem
  label: string
  description: string
}

const dataverseItems: DataverseItemDetails[] = [
  {
    type: 'dataspace',
    label: 'AG Open Data Space',
    description: 'Lorem ipsum dolor sit amet, consectetur '
  },
  {
    type: 'dataset',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description: 'Données publiques de météo'
  },
  {
    type: 'service',
    label: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip',
    description: 'Données publiques de météo'
  },
  {
    type: 'dataspace',
    label:
      'Vitae justo eget magna fermentum iaculis eu. Ullamcorper morbi tincidunt ornare massa eget egestas',
    description: 'Elementum metus magnis amet'
  },
  {
    type: 'dataset',
    label: 'This is a title that is much more letters and words',
    description: 'This is a description that is far too long to be written here in full.'
  },
  {
    type: 'service',
    label:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'dataspace',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description: 'Commodo dictumst porttitor at.'
  },
  {
    type: 'dataset',
    label:
      'Maecenas ultricies mi eget mauris pharetra et. Fermentum iaculis eu non diam phasellus.',
    description: 'Pellentesque.Ipsum odor amet'
  },
  {
    type: 'service',
    label: 'Id cursus metus aliquam eleifend',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'dataspace',
    label: 'Maecenas ultricies mi eget mauris pharetra et. Fermentum iaculis',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'dataset',
    label: 'Sed libero enim sed faucibus turpis.',
    description: 'Elementum metus magnis commodo dictumst'
  },
  {
    type: 'service',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'dataspace',
    label: 'Integer feugiat scelerisque varius morbi. Odio ut enim blandit volutpat maecenas vol',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'dataset',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'service',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'dataspace',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'dataset',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'service',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'dataspace',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  },
  {
    type: 'dataset',
    label: 'Lorem ipsum odor amet, consectetuer adipiscing elit',
    description:
      'Elementum metus magnis commodo dictumst porttitor at eu pellentesque.Ipsum odor amet'
  }
]

const renderTagColor = (itemType: DataverseItem): ColorVariant => {
  switch (itemType) {
    case 'service':
      return 'primary-color'
    case 'dataspace':
      return 'primary-color-variant-3'
    case 'dataset':
      return 'primary-color-variant-4'
  }
}

const renderItemContent = (item: DataverseItemDetails): string => `### ${item.label}
${item.description}`

const Dataverse = (): JSX.Element => {
  const { t } = useTranslation('common')

  const renderLabel = useCallback((itemType: DataverseItem) => t(`data.${itemType}`), [t])

  return (
    <div className="okp4-dataverse-portal-dataverse-page-main">
      <h1>{t('actions.explore')}</h1>
      <div className="okp4-dataverse-portal-dataverse-page-cards-container">
        {dataverseItems.map(item => (
          <Card key={item.label}>
            <div className="okp4-dataverse-portal-dataverse-page-card">
              <Tag colorVariant={renderTagColor(item.type)} label={renderLabel(item.type)} />
              <div className="okp4-dataverse-portal-dataverse-page-card-content">
                <div className="okp4-dataverse-portal-dataverse-page-description">
                  <ReactMarkdown>{renderItemContent(item)}</ReactMarkdown>
                </div>
                <Button disabled label={t('actions.details')} variant="primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Dataverse
