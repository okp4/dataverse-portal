import type { FC } from 'react'
import './card.scss'
import classNames from 'classnames'

export type CardBackground =
  | 'primary-color'
  | 'primary-color-variant-1'
  | 'primary-color-variant-2'
  | 'primary-color-variant-3'
  | 'card'

export type CardProps = {
  children: React.ReactElement
  background?: CardBackground
  mainClassName?: string
}

export const Card: FC<CardProps> = ({ children, mainClassName, background = 'card' }) => {
  return (
    <div className={classNames('okp4-dataverse-portal-card-main', mainClassName, background)}>
      {children}
    </div>
  )
}
