import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getResourceDetails } from '../dataverse'
import type { DataverseItemDetails } from '../dataverse'

const Dataset = (): JSX.Element => {
  const { id } = useParams<string>()
  const [dataset, setDataset] = useState<DataverseItemDetails | undefined>()

  useEffect(() => {
    id && setDataset(getResourceDetails(id))
  }, [id])
  return dataset ? <p> {dataset.label}</p> : <p>Dataset not found</p>
}

export default Dataset
