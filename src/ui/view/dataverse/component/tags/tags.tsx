import type { FC } from 'react'
import { Tag } from '@/ui/component/tag/tag'
import './tags.scss'

type TagsProps = {
  tags: string[]
}

export const Tags: FC<TagsProps> = ({ tags }): JSX.Element => (
  <div className="okp4-dataverse-portal-dataverse-component-description-tags">
    {tags.map((tag: string) => (
      <Tag key={tag} tagName={tag} />
    ))}
  </div>
)
