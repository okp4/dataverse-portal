import { useState, useEffect, useCallback, type RefObject } from 'react'
import { useWindowResize } from './useWindowResize'

type DropDirection = 'up' | 'down'

export const useDropDirection = (ref: RefObject<HTMLElement>): DropDirection => {
  const [direction, setDirection] = useState<DropDirection>('down')

  const updateDropDirection = useCallback(() => {
    if (ref.current) {
      setDirection(ref.current.getBoundingClientRect().y > window.innerHeight / 2 ? 'up' : 'down')
    }
  }, [ref])

  useWindowResize(updateDropDirection)

  useEffect(() => {
    updateDropDirection()
  }, [updateDropDirection])

  return direction
}
