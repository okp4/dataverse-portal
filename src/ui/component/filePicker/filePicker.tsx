import { useCallback, useMemo, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { DragAndDrop } from '@/ui/component/dragAndDrop/dragAndDrop'
import type { DragDropState } from '@/ui/component/dragAndDrop/dragAndDrop'
import { DropDownButton } from '@/ui/component/dropDownButton/dropDownButton'
import type { Option } from '@/ui/component/dropDownButton/dropDownButton'
import { Icon } from '@/ui/component/icon/icon'
import classNames from 'classnames'
import './i18n/index'
import './filePicker.scss'

// eslint-disable-next-line max-lines-per-function
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

  const handleFiles = useCallback((event: React.DragEvent<HTMLInputElement>) => {
    // TODO: Implement file domain function call
    console.log(event)
  }, [])

  const handleFolder = useCallback((event: React.DragEvent<HTMLInputElement>) => {
    // TODO: Implement file domain function call
    console.log(event)
  }, [])

  const filesInput = useMemo(
    () =>
      Object.assign(document.createElement('input'), {
        onchange: handleFiles,
        type: 'file',
        multiple: true
      }),
    [handleFiles]
  )

  const folderInput = useMemo(
    () =>
      Object.assign(document.createElement('input'), {
        onchange: handleFolder,
        type: 'file',
        webkitdirectory: true
      }),
    [handleFolder]
  )

  const dropDownButtonOptions: [Option, ...Option[]] = useMemo(
    () => [
      {
        label: t('file-picker.select-folder'),
        onClick: (): void => {
          folderInput.click()
        },
        icons: {
          startIcon: (
            <div className="okp4-dataverse-portal-file-picker-browse-icon">
              <Icon name="folder-opened" />
            </div>
          )
        }
      },
      {
        label: t('file-picker.select-files'),
        onClick: (): void => {
          filesInput.click()
        },
        icons: {
          startIcon: (
            <div className="okp4-dataverse-portal-file-picker-browse-icon">
              <Icon name="file-detailed" />
            </div>
          )
        }
      }
    ],
    [filesInput, folderInput, t]
  )

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
          <div className="okp4-dataverse-portal-file-picker-button-wrapper">
            <DropDownButton label={t('file-picker.browse')} options={dropDownButtonOptions} />
          </div>
        </div>
      </div>
    </DragAndDrop>
  )
}
