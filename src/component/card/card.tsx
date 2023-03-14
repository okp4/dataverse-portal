import type { FC } from 'react'
import './card.scss'
import classNames from 'classnames'

export type CardProps = {
  children: React.ReactElement
  mainClassName?: string
}

export const Card: FC<CardProps> = ({ children, mainClassName }) => (
  <div className={classNames('okp4-dataverse-portal-card-main', mainClassName)}>{children}</div>
)
