import { useCallback, type FC, useState } from 'react'
import classNames from 'classnames'
import { Trans } from 'react-i18next'
import { Tag } from '@/ui/component/tag/tag'
import '../i18n/index'
import './tagsField.scss'

type TagsFieldProps = {
  tags: string[]
  addTag: (tag: string) => void
  removeTag: (tag: string) => void
}

// eslint-disable-next-line max-lines-per-function
export const TagsField: FC<TagsFieldProps> = ({ tags, addTag, removeTag }) => {
  const [value, setValue] = useState('')

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value)
    },
    [setValue]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        const tag = event.currentTarget.value.trim()
        if (tag) {
          addTag(tag)
          setValue('')
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
      <div className="okp4-dataverse-portal-tags-field">
        <span
          className={classNames('okp4-dataverse-portal-tags-field-placeholder', { hidden: value })}
        >
          <Trans
            components={{
              span: <span className="okp4-dataverse-portal-tags-field-placeholder-action" />
            }}
            i18nKey="shareData:type-press-enter"
          />
        </span>
        <input
          className="okp4-dataverse-portal-tags-field-input"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          type="text"
          value={value}
        />
      </div>
    </div>
  )
}
