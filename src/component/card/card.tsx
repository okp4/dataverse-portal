import type { FC } from 'react'
import './card.scss'

export type CardProps = {
  children: React.ReactElement
}

export const Card: FC<CardProps> = ({ children }) => {
  return <div className="okp4-dataverse-portal-card-main">{children}</div>
}
