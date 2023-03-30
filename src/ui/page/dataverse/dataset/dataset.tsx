import type { FC } from 'react'
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
    iconName: 'file',
    title: 'format',
    description: 'text_csv'
  },
  {
    iconName: 'folder',
    title: 'topic',
    description: 'Agriculture Environment And Forestry'
  },
  {
    iconName: 'shield',
    title: 'license',
    description: 'licence:LO-FR-2_0'
  },
  {
    iconName: 'earth',
    title: 'geographicalCoverage',
    description: 'France'
  },
  {
    iconName: 'calendar',
    title: 'temporalCoverage',
    description: '2020'
  }
]

type MatchedDatasetProps = {
  label: string
}
const MatchedDataset: FC<MatchedDatasetProps> = ({ label }) => (
  <>
    <p>{label}</p>
    <GeneralMetadataList metadata={datasetGeneralMetadata} />
  </>
)

const Dataset = (): JSX.Element => {
  const { id } = useParams<string>()
  const [dataset, setDataset] = useState<Option<DataverseItemDetails>>(none)

  useEffect(() => {
    id && setDataset(getResourceDetails(id))
  }, [id])

  return match(
    () => <p>Dataset not found</p>,
    (dataset: DataverseItemDetails) => <MatchedDataset label={dataset.label} />
  )(dataset)
}

export default Dataset
