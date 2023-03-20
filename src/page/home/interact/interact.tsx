import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { CardBackground } from '@/component/card/card'
import { Card } from '@/component/card/card'
import classNames from 'classnames'
import './interact.scss'
import '../i18n/index'

type InteractCard = {
  category: string
  title: string
  tag: string
  disabled: string
  backgroundColor: CardBackground
}

// eslint-disable-next-line max-lines-per-function
export const Interact: FC = () => {
  const { t } = useTranslation('home')

  const interactCards: InteractCard[] = useMemo(
    () => [
      {
        category: t('home.blocks.interact.card1.category'),
        title: t('home.blocks.interact.card1.title'),
        tag: 'data-services',
        disabled: t('home.blocks.interact.disabled'),
        backgroundColor: 'primary-color-variant-1'
      },
      {
        category: t('home.blocks.interact.card2.category'),
        title: t('home.blocks.interact.card2.title'),
        tag: 'knowledge',
        disabled: t('home.blocks.interact.disabled'),
        backgroundColor: 'primary-color'
      },
      {
        category: t('home.blocks.interact.card3.category'),
        title: t('home.blocks.interact.card3.title'),
        tag: 'data-spaces',
        disabled: t('home.blocks.interact.disabled'),
        backgroundColor: 'primary-color-variant-2'
      },
      {
        category: t('home.blocks.interact.card4.category'),
        title: t('home.blocks.interact.card4.title'),
        tag: 'applications',
        disabled: t('home.blocks.interact.disabled'),
        backgroundColor: 'primary-color-variant-3'
      }
    ],
    [t]
  )
  return (
    <>
      <h1>{t('home.blocks.interact.label')}</h1>
      {interactCards.map(({ category, title, tag, disabled, backgroundColor }, index) => (
        <Card
          background={backgroundColor}
          key={index}
          mainClassName={classNames('okp4-dataverse-portal-home-page-interact-card', tag)}
        >
          <div>
            <h3>{category}</h3>
            <h2>{title}</h2>
            <div className="okp4-dataverse-portal-home-page-interact-card-disabled">
              <h2>{disabled}</h2>
            </div>
          </div>
        </Card>
      ))}
    </>
  )
}
