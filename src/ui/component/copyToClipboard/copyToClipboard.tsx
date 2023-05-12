import { useAppStore } from '@/ui/store/appStore'
import { useCallback, useEffect, useState } from 'react'
import type { IconName } from '@/ui/component/icon/icon'
import { Icon } from '@/ui/component/icon/icon'
import './copyToClipboard.scss'

type CopyToClipBoardProps = {
  textToCopy: string
  onCopied?: (isCopied: boolean) => void
}

export const CopyToClipboard = ({ onCopied, textToCopy }: CopyToClipBoardProps): JSX.Element => {
  const theme = useAppStore(state => state.theme)
  const [iconName, setIconName] = useState<IconName>(`copy-${theme}`)

  const handleClipboardCopy = useCallback(async (): Promise<void> => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setIconName(`copy-success-${theme}`)
        onCopied?.(true)
      })
      .catch((error: Error) => {
        console.error(error.message)
        setIconName(`copy-failure-${theme}`)
        onCopied?.(false)
      })
  }, [onCopied, textToCopy, theme])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIconName(`copy-${theme}`)
    }, 2000)
    return () => clearTimeout(timeout)
  }, [iconName, theme])

  useEffect(() => {
    setIconName(`copy-${theme}`)
  }, [theme])

  return (
    <div className="okp4-dataverse-portal-copy-paste-main">
      <div className="okp4-dataverse-portal-copy-paste-icon" onClick={handleClipboardCopy}>
        <Icon name={iconName} />
      </div>
    </div>
  )
}
