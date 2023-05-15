import classNames from 'classnames'
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
  const [showAnimation, setShowAnimation] = useState<boolean>(false)

  const handleClipboardCopy = useCallback(async (): Promise<void> => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setIconName(`copy-success-${theme}`)
        setShowAnimation(true)
        onCopied?.(true)
      })
      .catch((error: Error) => {
        console.error(error.message)
        setIconName(`copy-failure-${theme}`)
        setShowAnimation(true)
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
      <div
        className={classNames('okp4-dataverse-portal-copy-paste-icon', {
          'show-icon': showAnimation
        })}
        onClick={handleClipboardCopy}
      >
        <Icon name={iconName} />
      </div>
    </div>
  )
}
