import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as short from 'short-uuid'
import { File, FilePicker } from '@/ui/component/filePicker/filePicker'
import { useFileStore } from '@/ui/store'
import type { StoreFilesInput } from '@/domain/file/command'
import './dataSelection.scss'

export const DataSelection: FC = () => {
  const { t } = useTranslation('share')
  const { storeFiles } = useFileStore(state => ({
    storeFiles: state.storeFiles
  }))

  const handleFiles = (files: File[]) => {
    const storeFilesObject: StoreFilesInput = files.map((file: File) => ({
      id: short.generate(),
      name: file.name,
      path: file.fullPath,
      type: file.mediaType,
      stream: file.stream,
      size: file.size
    }))
    console.log(files[0].fullPath)
    storeFiles(storeFilesObject)()
  }

  return (
    <div className="okp4-dataverse-portal-share-data-selection-container">
      <h2>{t('share:share.dataset.select')}</h2>
      <div className="okp4-dataverse-portal-share-data-selection-descritpion">
        <h3>{t('share:share.dataset.selectDescription')}</h3>
      </div>
      <div className="okp4-dataverse-portal-share-data-selection-drag-drop-container">
        <FilePicker onFileChange={handleFiles} />
      </div>
      <div className="okp4-dataverse-portal-share-dataset-page-file-list-container">right</div>
    </div>
  )
}
