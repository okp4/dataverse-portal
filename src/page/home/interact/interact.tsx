import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { CardBackground } from '@/component/card/card'
import { Card } from '@/component/card/card'
import './interact.scss'
import '../i18n/index'

type InteractCard = {
  action: string
  category: string
  backgroundColor: CardBackground
}

// eslint-disable-next-line max-lines-per-function
export const Interact: FC = () => {
  const { t } = useTranslation('home')

  const interactCards: InteractCard[] = useMemo(
    () => [
      {
        action: t('home.blocks.interact.data-services.action'),
        category: t('home.blocks.interact.data-services.category'),
        backgroundColor: 'primary-color-variant-1'
      },
      {
        action: t('home.blocks.interact.knowledge.action'),
        category: t('home.blocks.interact.knowledge.category'),
        backgroundColor: 'primary-color'
      },
      {
        action: t('home.blocks.interact.data-spaces.action'),
        category: t('home.blocks.interact.data-spaces.category'),
        backgroundColor: 'primary-color-variant-2'
      },
      {
        action: t('home.blocks.interact.applications.action'),
        category: t('home.blocks.interact.applications.category'),
        backgroundColor: 'primary-color-variant-3'
      }
    ],
    [t]
  )
  return (
    <>
      <h1>{t('home.blocks.interact.label')}</h1>
      {interactCards.map(({ action, category, backgroundColor }, index) => (
        <Card
          background={backgroundColor}
          key={index}
          mainClassName="okp4-dataverse-portal-home-page-interact-card"
        >
          <div>
            <h3>{action}</h3>
            <h2>{category}</h2>
            <div className="okp4-dataverse-portal-home-page-interact-card-disabled">
              <h2>{t('home.blocks.interact.disabled')}</h2>
            </div>
          </div>
        </Card>
      ))}
    </>
  )
}
