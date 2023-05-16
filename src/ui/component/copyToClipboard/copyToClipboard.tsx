import { useCallback, useState } from 'react'
import { useAppStore } from '@/ui/store/appStore'
import { Icon } from '@/ui/component/icon/icon'
import classNames from 'classnames'
import './copyToClipboard.scss'

type CopyState = 'copy' | 'success' | 'error'

type CopyToClipBoardProps = {
  textToCopy: string
  onCopied?: (isCopied: boolean) => void
}

export const CopyToClipboard = ({ onCopied, textToCopy }: CopyToClipBoardProps): JSX.Element => {
  const theme = useAppStore(state => state.theme)
  const [copyState, setCopyState] = useState<CopyState>('copy')

  const handleClipboardCopy = useCallback(async (): Promise<void> => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopyState('success')
        onCopied?.(true)
      })
      .catch((error: Error) => {
        setCopyState('error')
        console.error(error.message)
        onCopied?.(false)
      })
  }, [onCopied, textToCopy])

  return (
    <div className="okp4-dataverse-portal-copy-paste-main">
      <div
        className={classNames('okp4-dataverse-portal-copy-paste-icons-container', copyState)}
        onClick={handleClipboardCopy}
      >
        <div className="okp4-dataverse-portal-copy-paste-icon copy">
          <Icon name={`copy-${theme}`} />
        </div>
        <div className="okp4-dataverse-portal-copy-paste-icon success">
          <Icon name="check" />
        </div>
        <div className="okp4-dataverse-portal-copy-paste-icon error">
          <Icon name="error" />
        </div>
      </div>
    </div>
  )
}
