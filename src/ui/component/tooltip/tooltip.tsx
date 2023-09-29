import { useEffect, useState } from 'react'
import type { FC } from 'react'
import classNames from 'classnames'
import * as RTooltip from '@radix-ui/react-tooltip'
import './tooltip.scss'

type TooltipProps = {
  content: JSX.Element
  trigger: JSX.Element
  contentClassName?: string
  triggerClassName?: string
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
  side?: 'left' | 'right' | 'top' | 'bottom'
  sideOffset?: number
  portalContainer?: HTMLElement
  delayDuration?: number
  width?: number
  arrowWidth?: number
  arrowHeight?: number
}

// eslint-disable-next-line max-lines-per-function
export const Tooltip: FC<TooltipProps> = ({
  content,
  contentClassName,
  trigger,
  triggerClassName,
  align = 'center',
  alignOffset = 0,
  side = 'right',
  sideOffset = 5,
  portalContainer,
  delayDuration = 400,
  width,
  arrowWidth = 16,
  arrowHeight = 8
}) => {
  const [containerElement, setContainerElement] = useState<HTMLElement | null>(
    portalContainer ?? null
  )

  useEffect(() => {
    if (containerElement) return

    setContainerElement(document.getElementById('tooltip-root'))
  }, [containerElement])

  return (
    <RTooltip.Provider delayDuration={delayDuration}>
      <RTooltip.Root>
        <RTooltip.Trigger
          className={classNames('okp4-dataverse-portal-tooltip-trigger-button', triggerClassName)}
        >
          {trigger}
        </RTooltip.Trigger>
        <RTooltip.Portal container={containerElement}>
          <RTooltip.Content
            align={align}
            alignOffset={alignOffset}
            className={classNames('okp4-dataverse-portal-tooltip-content', contentClassName)}
            side={side}
            sideOffset={sideOffset}
            style={{
              ...(width && { width: `${width}px` })
            }}
          >
            {content}
            <RTooltip.Arrow
              className="okp4-dataverse-portal-tooltip-arrow"
              height={arrowHeight}
              width={arrowWidth}
            />
          </RTooltip.Content>
        </RTooltip.Portal>
      </RTooltip.Root>
    </RTooltip.Provider>
  )
}
