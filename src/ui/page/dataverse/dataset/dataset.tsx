import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Option } from 'fp-ts/Option'
import { match, none } from 'fp-ts/Option'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import type { GeneralMetadata } from '@/page/dataverse/component/generalMetadata/generalMetadata'
import { GeneralMetadataList } from '@/page/dataverse/component/generalMetadata/generalMetadata'

const datasetGeneralMetadata: GeneralMetadata[] = [
  {
    iconName: 'draft',
    titleKey: 'format',
    description: 'text_csv'
  },
  {
    iconName: 'topic',
    titleKey: 'topic',
    description: 'Agriculture Environment And Forestry'
  },
  {
    iconName: 'shield',
    titleKey: 'license',
    description: 'licence:CC0'
  },
  {
    iconName: 'public',
    titleKey: 'geographical-coverage',
    description: 'World'
  },
  {
    iconName: 'event',
    titleKey: 'temporal-coverage',
    description: '2020'
  }
]

const Dataset = (): JSX.Element => {
  const { id } = useParams<string>()
  const [dataset, setDataset] = useState<Option<DataverseItemDetails>>(none)

  useEffect(() => {
    id && setDataset(getResourceDetails(id))
  }, [id])

  return match(
    () => <p>Dataset not found</p>,
    (dataset: DataverseItemDetails) => {
      return (
        <>
          <p>{dataset.label}</p>
          <GeneralMetadataList metadata={datasetGeneralMetadata} />
        </>
      )
    }
  )(dataset)
}

export default Dataset
