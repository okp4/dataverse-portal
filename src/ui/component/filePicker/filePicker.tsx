import { useCallback, useMemo, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { DragAndDrop } from '@/ui/component/dragAndDrop/dragAndDrop'
import type { DragDropState } from '@/ui/component/dragAndDrop/dragAndDrop'
import { DropDownButton } from '@/ui/component/dropDownButton/dropDownButton'
import type { Option } from '@/ui/component/dropDownButton/dropDownButton'
import { Icon } from '@/ui/component/icon/icon'
import { isError } from '@/util/util'
import classNames from 'classnames'
import './i18n/index'
import './filePicker.scss'

export type File = {
  name: string
  fullPath: string
  size: number
  mediaType: string
  stream: ReadableStream<Uint8Array>
}

type FilePickerProps = {
  onFileChange: (files: File[]) => void
  hasFolderExplorer?: boolean
  hasFileExplorer?: boolean
  multiple?: boolean
  onError?: (error: Error) => void
}

// eslint-disable-next-line max-lines-per-function
export const FilePicker: FC<FilePickerProps> = ({
  onFileChange,
  hasFolderExplorer = false,
  hasFileExplorer = false,
  multiple = false,
  onError
}): JSX.Element => {
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false)
  const { t } = useTranslation('filePicker')

  const handleDragAndDropState = useCallback((state: DragDropState) => {
    state === 'dragging-over' ? setIsDraggingOver(true) : setIsDraggingOver(false)
  }, [])

  const toFileDTO = useCallback(
    (file: globalThis.File) => ({
      name: file.name,
      fullPath: file.webkitRelativePath,
      size: file.size,
      mediaType: file.type,
      stream: file.stream()
    }),
    []
  )

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      const files = Array.from(event.dataTransfer.items).map(item => {
        try {
          const fsEntry = item.webkitGetAsEntry()
          const file = item.getAsFile()

          if (!fsEntry) throw new Error('Could not read item')
          if (!file || fsEntry.isDirectory) throw new Error('Dropped item not a file')

          return toFileDTO(file)
        } catch (error: unknown) {
          isError(error) && onError?.(error)
        }
      })

      !files.includes(undefined) && onFileChange(files as File[])
    },
    [onError, onFileChange, toFileDTO]
  )

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files
      if (fileList?.length) {
        const files = Array.from(fileList, toFileDTO)
        onFileChange(files)
      }
    },
    [onFileChange, toFileDTO]
  )

  const filesInput = useMemo(
    () =>
      Object.assign(document.createElement('input'), {
        onchange: handleFileChange,
        type: 'file',
        multiple
      }),
    [handleFileChange, multiple]
  )

  const folderInput = useMemo(
    () =>
      Object.assign(document.createElement('input'), {
        onchange: handleFileChange,
        type: 'file',
        webkitdirectory: true
      }),
    [handleFileChange]
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
      hasFileExplorer && hasFolderExplorer
        ? [folderButtonOption, filesButtonOption]
        : hasFileExplorer
        ? [filesButtonOption]
        : [folderButtonOption],
    [filesButtonOption, folderButtonOption, hasFileExplorer, hasFolderExplorer]
  )

  return (
    <DragAndDrop onChange={handleDragAndDropState} onDrop={handleDrop}>
      <div
        className={classNames('okp4-dataverse-portal-file-picker-main', {
          focused: isDraggingOver
        })}
      >
        <div className="okp4-dataverse-portal-file-picker-content-container">
          <Icon name="folder-outlined" />
          {hasFileExplorer || hasFolderExplorer ? (
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
