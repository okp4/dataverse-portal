import { useEffect } from 'react'
import type { RefObject } from 'react'

export type KeyboardEventType = 'keydown' | 'keypress' | 'keyup'

export const useOnKeyboard = <T extends HTMLElement = HTMLDivElement>(
  handler: (event: KeyboardEvent) => void,
  keyboardEvent: KeyboardEventType = 'keydown',
  ref?: RefObject<T | null>
): void => {
  useEffect(() => {
    const targetElement: T | Window = ref?.current ?? window
    const callback = (evt: Event): void => handler(evt as KeyboardEvent)

    targetElement.addEventListener(keyboardEvent, callback)

    return () => window.removeEventListener(keyboardEvent, callback)
  }, [handler, keyboardEvent, ref])
}
