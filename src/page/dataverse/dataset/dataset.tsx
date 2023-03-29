import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Option } from 'fp-ts/Option'
import { match, none } from 'fp-ts/Option'
import { getResourceDetails } from '../dataverse'
import type { DataverseItemDetails } from '../dataverse'
import '../index.scss'

const Dataset = (): JSX.Element => {
  const { id } = useParams<string>()
  const [dataset, setDataset] = useState<Option<DataverseItemDetails>>(none)

  useEffect(() => {
    id && setDataset(getResourceDetails(id))
  }, [id])

  return match(
    () => <p>Dataset not found</p>,
    (dataset: DataverseItemDetails) =>
      <div className='okp4-dataverse-portal-dataverse-index-description-main'>
        <div className='okp4-dataverse-portal-dataverse-index-description-wrapper'>
          <div className='okp4-dataverse-portal-dataverse-index-description-category'>{dataset.type}</div>
          <div className='okp4-dataverse-portal-dataverse-index-description-label'>{dataset.label}</div>
          <div className='okp4-dataverse-portal-dataverse-index-description-text'>{dataset.description}</div>
        </div>
      </div>
  )(dataset)
}

export default Dataset
