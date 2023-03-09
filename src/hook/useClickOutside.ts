import type { RefObject } from 'react'
import { useCallback, useEffect } from 'react'

type Event = MouseEvent | TouchEvent

// Callback is the type of the function called when the user clicks outside the element.
export type Callback = (event: Event) => void

// useOnClickOutside is a custom hook that calls the callback function when the user clicks outside the given element.
export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  callback: Callback
): void => {
  const listener = useCallback(
    (event: Event) => {
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
