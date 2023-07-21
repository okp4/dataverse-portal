import { useState, useEffect, useCallback, type RefObject } from 'react'
import { useWindowResize } from './useWindowResize'

type DropDirection = 'dropup' | 'dropdown'

export const useDropDirection = (ref: RefObject<HTMLElement>): DropDirection => {
  const [direction, setDirection] = useState<DropDirection>('dropdown')

  const updateDropDirection = useCallback(() => {
    if (ref.current) {
      setDirection(
        ref.current.getBoundingClientRect().y > window.innerHeight / 2 ? 'dropup' : 'dropdown'
      )
    }
  }, [ref])

  useWindowResize(updateDropDirection)

  useEffect(() => {
    updateDropDirection()
  }, [updateDropDirection])

  return direction
}
