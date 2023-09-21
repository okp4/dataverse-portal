import type { FC } from 'react'
import './card.scss'
import classNames from 'classnames'

export type CardBackground =
  | 'knowledge-tree'
  | 'data-services-tree'
  | 'zones-tree'
  | 'applications-tree'
  | 'card'

export type CardProps = {
  children: React.ReactElement
  background?: CardBackground
  mainClassName?: string
  onClick?: () => void
}

export const Card: FC<CardProps> = ({ children, mainClassName, onClick, background = 'card' }) => {
  return (
    <div
      className={classNames('okp4-dataverse-portal-card-main', mainClassName, background)}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
