import { useCallback, type FC, useState } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Tag } from '@/ui/component/tag/tag'
import './i18n/index'
import './tagsField.scss'

type TagsFieldProps = {
  tags: string[]
  addTag: (tag: string) => void
  removeTag: (tag: string) => void
}

// eslint-disable-next-line max-lines-per-function
export const TagsField: FC<TagsFieldProps> = ({ tags, addTag, removeTag }) => {
  const [inputValue, setInputValue] = useState('')
  const { t } = useTranslation('tagsField')

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value)
    },
    [setInputValue]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        const tag = inputValue.trim()
        if (tag) {
          addTag(tag)
          setInputValue('')
        }
      }
    },
    [addTag, inputValue]
  )

  const handleDelete = useCallback(
    (tag: string) => (): void => {
      removeTag(tag)
    },
    [removeTag]
  )

  return (
    <div className="okp4-dataverse-portal-tags-field-main">
      <div className="okp4-dataverse-portal-tags-field-content">
        {tags.map((tag: string, index: number) => (
          <Tag key={`${tag}-${index}`} onDelete={handleDelete(tag)} tagName={tag} />
        ))}
        <div className="okp4-dataverse-portal-tags-field">
          <span
            className={classNames('okp4-dataverse-portal-tags-field-placeholder', {
              hidden: inputValue
            })}
          >
            {t('typeAndPress')}
            <span className="okp4-dataverse-portal-tags-field-placeholder-action">
              {t('enter')}
            </span>
          </span>
          <input
            className="okp4-dataverse-portal-tags-field-input"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            type="text"
            value={inputValue}
          />
        </div>
      </div>
    </div>
  )
}
