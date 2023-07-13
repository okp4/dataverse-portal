import { useCallback, type FC } from 'react'
import { Tag } from '@/ui/component/tag/tag'
import './tagsField.scss'

type TagsFieldProps = {
  tags: string[]
  addTag: (tag: string) => void
  removeTag: (tag: string) => void
}

export const TagsField: FC<TagsFieldProps> = ({ tags, addTag, removeTag }) => {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        const tag = event.currentTarget.value
        if (tag) {
          addTag(tag)
          event.currentTarget.value = ''
        }
      }
    },
    [addTag]
  )

  const handleDelete = useCallback(
    (tag: string) => (): void => {
      removeTag(tag)
    },
    [removeTag]
  )

  return (
    <div className="okp4-dataverse-portal-tags-field-main">
      {tags.map((tag: string, index: number) => (
        <Tag key={`${tag}-${index}`} onDelete={handleDelete(tag)} tagName={tag} />
      ))}
      <input
        className="okp4-dataverse-portal-tags-field-input"
        onKeyDown={handleKeyDown}
        placeholder="Type and press enter"
        type="text"
      />
    </div>
  )
}
