import { useCallback, useEffect } from 'react'
import { useAppStore } from '@/ui/store/appStore'
import { Icon } from '@/ui/component/icon/icon'
import classNames from 'classnames'
import { useCopyToClipboard } from '@/ui/hook/useCopyToClipboard'
import './copyToClipboard.scss'

type CopyToClipBoardProps = {
  textToCopy: string
  animationDelay?: number
  onCopied?: (isCopied: boolean) => void
}

export const CopyToClipboard = ({
  animationDelay = 2000,
  onCopied,
  textToCopy
}: CopyToClipBoardProps): JSX.Element => {
  const theme = useAppStore(state => state.theme)
  const {
    copyState: { status: copyStatus },
    handleCopy
  } = useCopyToClipboard(animationDelay)

  const handleClick = useCallback(() => {
    handleCopy(textToCopy)
  }, [handleCopy, textToCopy])

  useEffect(() => {
    copyStatus === 'success' && onCopied?.(true)
    copyStatus === 'error' && onCopied?.(false)
  }, [copyStatus, onCopied])

  return (
    <div className="okp4-dataverse-portal-copy-paste-main">
      <div
        className={classNames('okp4-dataverse-portal-copy-paste-icons-container', copyStatus)}
        onClick={handleClick}
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
