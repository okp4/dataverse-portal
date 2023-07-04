/* eslint-disable max-lines-per-function */
import { useCallback, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as short from 'short-uuid'
import type { File } from '@/ui/component/filePicker/filePicker'
import { FilePicker } from '@/ui/component/filePicker/filePicker'
import { type Item, List } from '@/ui/component/list/list'
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

  const handleFileChange = useCallback(
    (files: File[]): void => {
      const storeFilesInput: StoreFilesInput = files.map(
        ({ name, webkitRelativePath, size, stream, type }: File) => ({
          id: short.generate(),
          name,
          path: webkitRelativePath ? webkitRelativePath : `/${name}`,
          type,
          stream,
          size
        })
      )
      storeFiles(storeFilesInput)()
    },
    [storeFiles]
  )

  const handleFileDeletion = useCallback(
    (fileId: string) => () => removeFile(fileId)(),
    [removeFile]
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
