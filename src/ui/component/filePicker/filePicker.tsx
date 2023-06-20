import { useCallback, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { DragAndDrop } from '@/ui/component/dragAndDrop/dragAndDrop'
import type { DragDropState } from '@/ui/component/dragAndDrop/dragAndDrop'
import { Icon } from '@/ui/component/icon/icon'
import classNames from 'classnames'
import './i18n/index'
import './filePicker.scss'

export const FilePicker: FC = (): JSX.Element => {
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false)
  const { t } = useTranslation('file-picker')

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
          <Icon name={'folder-outlined'} />
          <div>
            <p className="okp4-dataverse-portal-file-picker-content-description bold">
              {t('file-picker.drag-and-drop-files')}
            </p>
            <p className="okp4-dataverse-portal-file-picker-content-description">
              {t('file-picker.or')}
            </p>
          </div>
        </div>
      </div>
    </DragAndDrop>
  )
}
