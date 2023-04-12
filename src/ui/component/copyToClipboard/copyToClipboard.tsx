import { useAppStore } from '@/ui/store/appStore'
import { useCallback } from 'react'
import { Icon } from '@/ui/component/icon/icon'
import './copyToClipboard.scss'

type CopyToClipBoardProps = {
  textToCopy: string
  onCopied?: (isCopied: boolean) => void
}

export const CopyToClipboard = ({ onCopied, textToCopy }: CopyToClipBoardProps): JSX.Element => {
  const theme = useAppStore(state => state.theme)

  const handleClipboardCopy = useCallback(async (): Promise<void> => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        onCopied?.(true)
      })
      .catch((error: Error) => {
        console.error(error.message)
        onCopied?.(false)
      })
  }, [onCopied, textToCopy])

  return (
    <div className="okp4-dataverse-portal-copy-paste-main">
      <div className="okp4-dataverse-portal-copy-paste-icon" onClick={handleClipboardCopy}>
        <Icon name={`copy-${theme}`} />
      </div>
    </div>
  )
}
