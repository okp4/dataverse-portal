import { useCallback, useState } from 'react'
import { useTimeout } from '@/ui/hook/useTimeout'

export type CopyState =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: Error }

type HandleCopy = (textToCopy: string) => Promise<void>

type UseCopyToClipboard = { copyState: CopyState; handleCopy: HandleCopy }

export const useCopyToClipboard = (copyResetDelay?: number): UseCopyToClipboard => {
  const [copyState, setCopyState] = useState<CopyState>({
    status: 'idle'
  })

  const resetCopyState = useCallback((): void => {
    setCopyState({
      status: 'idle'
    })
  }, [])

  const handleCopy = useCallback(
    async (textToCopy: string): Promise<void> =>
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setCopyState({
            status: 'success',
            message: textToCopy
          })
        })
        .catch((error: Error) => {
          setCopyState({
            status: 'error',
            message: error
          })
          console.error(error.message)
        }),
    []
  )

  useTimeout(resetCopyState, copyResetDelay && copyState.status !== 'idle' ? copyResetDelay : null)

  return { copyState, handleCopy }
}
