import type { FC } from 'react'
import { useState, useCallback, useRef } from 'react'
import classNames from 'classnames'
import { Icon } from '@/ui/component/icon/icon'
import './searchbar.scss'

type SearchbarProps = {
  value: string
  onSearch: (value: string) => void
  placeholder?: string
}

export const SearchBar: FC<SearchbarProps> = ({ placeholder = '', value, onSearch }) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      onSearch(event.target.value)
    },
    [onSearch]
  )

  const handleFocus = useCallback((): void => {
    searchInputRef.current?.focus()
    setIsFocused(true)
  }, [])

  const handleBlur = useCallback((): void => {
    setIsFocused(false)
  }, [])

  return (
    <div
      className={classNames('okp4-dataverse-portal-searchbar-main', {
        focused: isFocused
      })}
      onClick={handleFocus}
    >
      <Icon name="magnifier" />
      <input
        autoCorrect="off"
        className="okp4-dataverse-portal-searchbar-input"
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        ref={searchInputRef}
        spellCheck={false}
        type="search"
        value={value}
      />
    </div>
  )
}
