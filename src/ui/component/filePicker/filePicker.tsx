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

type FilePickerProps = {
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void
  onFileChange?: (event: React.DragEvent<HTMLInputElement>) => void
  onFolderChange?: (event: React.DragEvent<HTMLInputElement>) => void
  multiple?: boolean
}

// eslint-disable-next-line max-lines-per-function
export const FilePicker: FC<FilePickerProps> = ({
  onFileChange,
  onFolderChange,
  onDrop,
  multiple = false
}): JSX.Element => {
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false)
  const { t } = useTranslation('filePicker')

  const handleDragAndDropState = useCallback((state: DragDropState) => {
    state === 'dragging-over' ? setIsDraggingOver(true) : setIsDraggingOver(false)
  }, [])

  const filesInput = useMemo(
    () =>
      Object.assign(document.createElement('input'), {
        onchange: onFileChange,
        type: 'file',
        multiple
      }),
    [multiple, onFileChange]
  )

  const folderInput = useMemo(
    () =>
      Object.assign(document.createElement('input'), {
        onchange: onFolderChange,
        type: 'file',
        webkitdirectory: true
      }),
    [onFolderChange]
  )

  const folderButtonOption: Option = useMemo(
    () => ({
      label: t('filePicker.select-folder'),
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
    }),
    [folderInput, t]
  )

  const filesButtonOption: Option = useMemo(
    () => ({
      label: multiple ? t('filePicker.select-files') : t('filePicker.select-file'),
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
    }),
    [filesInput, multiple, t]
  )

  const dropDownButtonOptions: [Option, ...Option[]] = useMemo(
    () =>
      onFileChange && onFolderChange
        ? [folderButtonOption, filesButtonOption]
        : onFileChange
        ? [filesButtonOption]
        : [folderButtonOption],
    [filesButtonOption, folderButtonOption, onFileChange, onFolderChange]
  )

  return (
    <DragAndDrop onChange={handleDragAndDropState} onDrop={onDrop}>
      <div
        className={classNames('okp4-dataverse-portal-file-picker-main', {
          focused: isDraggingOver
        })}
      >
        <div className="okp4-dataverse-portal-file-picker-content-container">
          <Icon name="folder-outlined" />
          {onFileChange || onFolderChange ? (
            <>
              <div>
                <p className="okp4-dataverse-portal-file-picker-content-description bold">
                  {t('filePicker.drag-and-drop-files')}
                </p>
                <p className="okp4-dataverse-portal-file-picker-content-description">
                  {t('filePicker.or')}
                </p>
              </div>
              <div className="okp4-dataverse-portal-file-picker-button-wrapper">
                <DropDownButton label={t('filePicker.browse')} options={dropDownButtonOptions} />
              </div>
            </>
          ) : (
            <div>
              <p className="okp4-dataverse-portal-file-picker-content-description bold">
                {t('filePicker.drag-and-drop-files')}
              </p>
            </div>
          )}
        </div>
      </div>
    </DragAndDrop>
  )
}
