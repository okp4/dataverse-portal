import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Option } from 'fp-ts/Option'
import { match, none } from 'fp-ts/Option'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import type { MetadataProperty } from '@/page/dataverse/component/generalMetadata/generalMetadata'
import { GeneralMetadataList } from '@/page/dataverse/component/generalMetadata/generalMetadata'

const datasetGeneralMetadata: MetadataProperty[] = [
  {
    iconName: 'file',
    property: 'format',
    value: 'text_csv'
  },
  {
    iconName: 'folder',
    property: 'topic',
    value: 'Agriculture Environment And Forestry'
  },
  {
    iconName: 'shield',
    property: 'license',
    value: 'licence:LO-FR-2_0'
  },
  {
    iconName: 'earth',
    property: 'geographicalCoverage',
    value: 'France'
  },
  {
    iconName: 'calendar',
    property: 'temporalCoverage',
    value: '2022-01-01T00:00:00+00:00'
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
