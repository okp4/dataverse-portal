import { useCallback, useEffect, useRef, useState } from 'react'
import type { FC } from 'react'

export type DragDropState = 'dragging-over' | 'not-dragging-over' | 'dropped'
type DragEvent = React.DragEvent<HTMLDivElement>

type DragAndDropProps = {
  children: JSX.Element
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void
  onChange?: (dragDropState: DragDropState) => void
}

export const DragAndDrop: FC<DragAndDropProps> = ({ children, onDrop, onChange }): JSX.Element => {
  const [dragDropState, setDragDropState] = useState<DragDropState>('not-dragging-over')
  const depthRef = useRef<number>(0)

  const preventDefaultAndStopPropagation = useCallback((event: DragEvent): void => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  const handleDragEnter = useCallback(() => {
    depthRef.current++

    depthRef.current === 1 && setDragDropState('dragging-over')
  }, [])

  const handleDragLeave = useCallback(() => {
    depthRef.current--
    depthRef.current === 0 && setDragDropState('not-dragging-over')
  }, [])

  const handleDrop = useCallback(
    (event: DragEvent) => {
      preventDefaultAndStopPropagation(event)
      setDragDropState('dropped')
      onDrop?.(event)
      depthRef.current = 0
    },
    [onDrop, preventDefaultAndStopPropagation]
  )

  useEffect(() => {
    onChange?.(dragDropState)
  }, [onChange, dragDropState])

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={preventDefaultAndStopPropagation}
      onDrop={handleDrop}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </div>
  )
}
