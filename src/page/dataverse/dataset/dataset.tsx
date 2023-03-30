import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Option } from 'fp-ts/Option'
import { match, none } from 'fp-ts/Option'
import { getResourceDetails } from '@/page/dataverse/dataverse'
import type { DataverseItemDetails } from '@/page/dataverse/dataverse'
import DataversePageTemplate from '../components/pageTemplate/pageTemplate'

const Dataset = (): JSX.Element => {
  const { id } = useParams<string>()
  const [dataset, setDataset] = useState<Option<DataverseItemDetails>>(none)

  useEffect(() => {
    id && setDataset(getResourceDetails(id))
  }, [id])

  return match(
    () => <p>Dataset not found</p>,
    (dataset: DataverseItemDetails) =>
      <DataversePageTemplate data={dataset} />
  )(dataset)
}

export default Dataset

