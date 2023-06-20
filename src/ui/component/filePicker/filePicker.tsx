import { useCallback, useState } from 'react'
import type { FC } from 'react'
import { DragAndDrop } from '@/ui/component/dragAndDrop/dragAndDrop'
import type { DragDropState } from '@/ui/component/dragAndDrop/dragAndDrop'
import classNames from 'classnames'
import './filePicker.scss'

export const FilePicker: FC = (): JSX.Element => {
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false)

  const handleDragAndDropState = useCallback((state: DragDropState) => {
    state === 'dragging-over' ? setIsDraggingOver(true) : setIsDraggingOver(false)
  }, [])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    // TODO: Implement file domain function call
    console.log(event)
  }, [])

  return (
    <DragAndDrop onChange={handleDragAndDropState} onDrop={handleDrop}>
      <div
        className={classNames('okp4-dataverse-portal-file-picker-main', {
          focused: isDraggingOver
        })}
      >
        <div className="okp4-dataverse-portal-file-picker-content-container">
        </div>
      </div>
    </DragAndDrop>
  )
}
