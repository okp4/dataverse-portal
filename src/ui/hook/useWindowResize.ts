import { useEffect } from 'react'
import { useDebounce } from './useDebounce'

export const useWindowResize = (callback: () => void): void => {
  const debouncedValue = useDebounce<() => void>(callback)

  useEffect(() => {
    window.addEventListener('resize', debouncedValue)

    return (): void => {
      window.removeEventListener('resize', debouncedValue)
    }
  }, [callback, debouncedValue])
}
