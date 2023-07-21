import { useEffect, useCallback, useState } from 'react'

type ResizeCallback = () => void

export const useWindowResize = (callback: ResizeCallback): void => {
  const [resizeTimer, setResizeTimer] = useState<NodeJS.Timeout | null>(null)

  const debouncedResize = useCallback((): void => {
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }

    const newTimer = setTimeout(callback, 500)

    setResizeTimer(newTimer)
  }, [resizeTimer, callback])

  useEffect(() => {
    window.addEventListener('resize', debouncedResize)

    return (): void => {
      window.removeEventListener('resize', debouncedResize)

      if (resizeTimer) {
        clearTimeout(resizeTimer)
      }
    }
  }, [callback, debouncedResize, resizeTimer])
}
