import type { FC } from 'react'
import { Tag } from '@/component/tag/tag'
import './tags.scss'

type TagsProps = {
  tags?: Array<string>
}

const Tags: FC<TagsProps> = ({ tags }): JSX.Element => (
  <div className='okp4-dataverse-portal-dataverse-component-description-tags'>
    {tags?.map((tag: string) => {
      return <Tag key={`dataset-tags-${tag}`} tagName={tag} ></Tag>
    })}
  </div>
)

export default Tags
