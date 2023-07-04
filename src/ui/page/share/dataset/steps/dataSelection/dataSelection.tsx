/* eslint-disable max-lines-per-function */
import { pipe } from 'fp-ts/lib/function'
import * as IOE from 'fp-ts/IOEither'
import { useCallback, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as short from 'short-uuid'
import type { File } from '@/ui/component/filePicker/filePicker'
import { FilePicker } from '@/ui/component/filePicker/filePicker'
import { type Item, List } from '@/ui/component/list/list'
import { Icon } from '@/ui/component/icon/icon'
import { useFileStore } from '@/ui/store'
import {
  ShowFileError,
  type FileError,
  type FileId,
  type StoreFilesInput
} from '@/domain/file/command'
import './dataSelection.scss'
import {
  useDispatchNotification,
  type DispatchNotificationInput
} from '@/ui/hook/useDispatchNotification'

export const DataSelection: FC = () => {
  const { t } = useTranslation('share')
  const { files, removeFile, storeFiles } = useFileStore(state => ({
    files: state.filesDescriptor,
    removeFile: state.removeFile,
    storeFiles: state.storeFiles
  }))
  const dispatchNotification = useDispatchNotification()

  const handleFileError = useCallback(
    (error: FileError) => {
      const notificationInput: DispatchNotificationInput = {
        type: 'error',
        titleKey: 'error.problem',
        messageKey: 'error.processing',
        action: 'refresh'
      }
      console.error(ShowFileError.show(error))
      dispatchNotification(notificationInput)
    },
    [dispatchNotification]
  )

  const handleFileChange = useCallback(
    (files: File[]): void => {
      const storeFilesInput: StoreFilesInput = files.map(
        ({ name, fullPath: path, size, stream, mediaType: type }: File) => ({
          id: short.generate(),
          name,
          path,
          type,
          stream,
          size
        })
      )
      pipe(storeFilesInput, storeFiles, IOE.mapLeft(handleFileError))()
    },
    [storeFiles, handleFileError]
  )

  const handleFileDeletion = useCallback(
    (fileId: FileId) => () => {
      pipe(fileId, removeFile, IOE.mapLeft(handleFileError))()
    },
    [handleFileError, removeFile]
  )

  const items: Item[] = files()().map(({ id, name }) => ({
    content: <p>{name}</p>,
    id,
    key: id,
    leftElement: (
      <div className="okp4-dataverse-portal-share-dataset-page-file-icon">
        <Icon name="folder-outlined" />
      </div>
    ),
    rightElement: (
      <div
        className="okp4-dataverse-portal-share-dataset-page-file-deletion"
        onClick={handleFileDeletion(id)}
      >
        <Icon name="bin" />
      </div>
    )
  }))

  return (
    <div className="okp4-dataverse-portal-share-data-selection-container">
      <h2>{t('share:share.dataset.select')}</h2>
      <div className="okp4-dataverse-portal-share-data-selection-description">
        <h3>{t('share:share.dataset.selectDescription')}</h3>
      </div>
      <div className="okp4-dataverse-portal-share-data-selection-drag-drop-container">
        <FilePicker hasFileExplorer hasFolderExplorer multiple onFileChange={handleFileChange} />
      </div>
      <div className="okp4-dataverse-portal-share-dataset-page-file-list-container">
        <List
          classes={{ main: 'okp4-dataverse-portal-share-dataset-page-file-list' }}
          items={items}
        />
      </div>
    </div>
  )
}
