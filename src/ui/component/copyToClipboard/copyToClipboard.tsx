import { useAppStore } from '@/ui/store/appStore'
import { useCallback } from 'react'
import { Icon } from '@/ui/component/icon/icon'
import './copyToClipboard.scss'

type CopyToClipBoardProps = {
  textToCopy: string
  handleCopy?: (isCopied: boolean) => void
}

export const CopyToClipboard = ({ handleCopy, textToCopy }: CopyToClipBoardProps): JSX.Element => {
  const theme = useAppStore(state => state.theme)

  const handleClipboardCopy = useCallback(async (): Promise<void> => {
    await navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        handleCopy?.(true)
      })
      .catch((error: Error) => {
        console.error(error.message)
        handleCopy?.(false)
      })
  }, [handleCopy, textToCopy])

  return (
    <div className="okp4-dataverse-portal-copy-paste-main">
      <div className="okp4-dataverse-portal-copy-paste-icon" onClick={handleClipboardCopy}>
        <Icon name={`copy-${theme}`} />
      </div>
    </div>
  )
}
