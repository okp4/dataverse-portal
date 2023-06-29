/* eslint-disable max-lines-per-function */
import { useCallback, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as short from 'short-uuid'
import type { File } from '@/ui/component/filePicker/filePicker'
import { FilePicker } from '@/ui/component/filePicker/filePicker'
import { List, ListItem } from '@/ui/component/list/list'
import { Icon } from '@/ui/component/icon/icon'
import { useFileStore } from '@/ui/store'
import type { StoreFilesInput } from '@/domain/file/command'
import './dataSelection.scss'

export const DataSelection: FC = () => {
  const { t } = useTranslation('share')
  const { files, removeFile, storeFiles } = useFileStore(state => ({
    files: state.filesDescriptor,
    removeFile: state.removeFile,
    storeFiles: state.storeFiles
  }))

  const handleFiles = useCallback(
    (files: File[]): void => {
      const mappedStoreFiles: StoreFilesInput = files.map((file: File) => ({
        id: short.generate(),
        name: file.name,
        path: file.fullPath,
        type: file.mediaType,
        stream: file.stream,
        size: file.size
      }))
      storeFiles(mappedStoreFiles)()
    },
    [storeFiles]
  )

  const handleFileDeletion = useCallback(
    (fileId: string) => () => removeFile(fileId)(),
    [removeFile]
  )

  return (
    <div className="okp4-dataverse-portal-share-data-selection-container">
      <h2>{t('share:share.dataset.select')}</h2>
      <div className="okp4-dataverse-portal-share-data-selection-description">
        <h3>{t('share:share.dataset.selectDescription')}</h3>
      </div>
      <div className="okp4-dataverse-portal-share-data-selection-drag-drop-container">
        <FilePicker hasFileExplorer hasFolderExplorer multiple onFileChange={handleFiles} />
      </div>
      <div className="okp4-dataverse-portal-share-dataset-page-file-list-container">
        <List className="okp4-dataverse-portal-share-dataset-page-file-list">
          {files()().map(({ id, name }) => (
            <ListItem
              content={<p>{name}</p>}
              key={id}
              leftElement={
                <div className="okp4-dataverse-portal-share-dataset-page-file-icon">
                  <Icon name="folder-outlined" />
                </div>
              }
              rightElement={
                <div
                  className="okp4-dataverse-portal-share-dataset-page-file-deletion"
                  onClick={handleFileDeletion(id)}
                >
                  <Icon name="bin" />
                </div>
              }
            />
          ))}
        </List>
      </div>
    </div>
  )
}
