import { useState, useEffect, useCallback, type RefObject } from 'react'

export const useDropDirection = (ref: RefObject<HTMLElement>): boolean => {
  const [dropup, setDropup] = useState(false)

  const updateDropDirection = useCallback(() => {
    if (ref.current) {
      setDropup(ref.current.getBoundingClientRect().y > window.innerHeight / 2)
    }
  }, [ref])

  useEffect(() => {
    updateDropDirection()

    window.addEventListener('resize', updateDropDirection)

    return (): void => {
      window.removeEventListener('resize', updateDropDirection)
    }
  }, [updateDropDirection])

  return dropup
}
