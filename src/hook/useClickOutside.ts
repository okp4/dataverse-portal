import type { RefObject } from 'react'
import { useCallback, useEffect } from 'react'

type EventParameter = MouseEvent | TouchEvent

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  callback: (event: EventParameter) => void
): void => {
  const listener = useCallback(
    (event: EventParameter) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return
      callback(event)
    },
    [callback, ref]
  )

  useEffect(() => {
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [listener, ref])
}
