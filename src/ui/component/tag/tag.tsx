import type { FC } from 'react'
import './tag.scss'

type TagProps = {
  tagName: string
}

export const Tag: FC<TagProps> = ({ tagName }) => (
  <div className="okp4-dataverse-portal-tag-main">
    <div className='okp4-dataverse-portal-tag-name'>{tagName}</div>
  </div>
)