import { useEffect, useState } from 'react'

export type LocalStorageState = [string | null, (value: string) => void]

const getLocalStorageValue = (key: string): string | null => localStorage.getItem(key)

export const useLocalStorage = (key: string): LocalStorageState => {
  const [value, setValue]: LocalStorageState = useState('')

  useEffect(() => {
    const lsValue = getLocalStorageValue(key)
    if (lsValue) setValue(lsValue)
  }, [key])

  useEffect(() => {
    if (!value) return
    localStorage.setItem(key, value)
  }, [key, value])

  return [value, setValue]
}
