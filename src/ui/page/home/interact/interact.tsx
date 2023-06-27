import type { FC } from 'react'
import { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import type { CardBackground } from '@/ui/component/card/card'
import { Card } from '@/ui/component/card/card'
import { routes } from '@/ui/routes'
import './interact.scss'
import '../i18n/index'

type InteractCard = {
  action: string
  category: string
  disabled?: boolean
  style: {
    backgroundColor: CardBackground
  }
  path?: string
}

// eslint-disable-next-line max-lines-per-function
export const Interact: FC = () => {
  const { t } = useTranslation('home')

  const navigate = useNavigate()
  const handleNavigateTo = useCallback((path: string) => () => navigate(path), [navigate])

  const interactCards: InteractCard[] = useMemo(
    () => [
      {
        action: t('home.blocks.interact.data-services.action'),
        category: t('home.blocks.interact.data-services.category'),
        style: {
          backgroundColor: 'primary-color-variant-1'
        },
        path: routes.share
      },
      {
        action: t('home.blocks.interact.knowledge.action'),
        category: t('home.blocks.interact.knowledge.category'),
        disabled: true,
        style: {
          backgroundColor: 'primary-color'
        }
      },
      {
        action: t('home.blocks.interact.data-spaces.action'),
        category: t('home.blocks.interact.data-spaces.category'),
        disabled: true,
        style: {
          backgroundColor: 'primary-color-variant-2'
        }
      },
      {
        action: t('home.blocks.interact.applications.action'),
        category: t('home.blocks.interact.applications.category'),
        disabled: true,
        style: {
          backgroundColor: 'primary-color-variant-3'
        }
      }
    ],
    [t]
  )

  return (
    <>
      <h1>{t('home.blocks.interact.label')}</h1>
      {interactCards.map(({ action, category, disabled, style, path }, index) => (
        <Card
          background={style.backgroundColor}
          key={index}
          mainClassName={classNames('okp4-dataverse-portal-home-page-interact-card', { disabled })}
          {...(path && { onClick: handleNavigateTo(path) })}
        >
          <div>
            <h3>{action}</h3>
            <h2>{category}</h2>
            {disabled && (
              <h2 className="okp4-dataverse-portal-home-page-interact-card-disabled-text">
                {t('home.blocks.interact.disabled')}
              </h2>
            )}
          </div>
        </Card>
      ))}
    </>
  )
}
