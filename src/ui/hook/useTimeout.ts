import { useCallback, useEffect, useRef } from 'react'

type UseTimeout = () => void

export const useTimeout = (callback: () => void, delay: number | null): UseTimeout => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const set = useCallback(() => {
    timeoutRef.current = delay !== null ? setTimeout(() => callback(), delay) : null
  }, [callback, delay])

  const disposerFn = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current)
  }, [])

  useEffect(() => {
    set()
    return disposerFn
  }, [set, disposerFn])

  return disposerFn
}
