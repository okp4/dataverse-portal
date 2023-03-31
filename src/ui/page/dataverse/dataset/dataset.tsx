import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Option } from 'fp-ts/Option'
import { match, none } from 'fp-ts/Option'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import type { MetadataProperty } from '@/ui/view/dataverse/component/generalMetadata/generalMetadata'
import PageTemplate from '@/ui/view/dataverse/component/pageTemplate/pageTemplate'

const datasetGeneralMetadata: MetadataProperty[] = [
  {
    iconName: 'file',
    property: 'format',
    value: 'text_csv'
  },
  {
    iconName: 'folder',
    property: 'topic',
    value: 'industryMobilityAndEngineering'
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

  const metadata = {
    tags: ['Agriculture', 'France', 'Open data', 'Rendement', 'Departement', 'Superficie', 'RPG']
  }

  useEffect(() => {
    id && setDataset(getResourceDetails(id))
  }, [id])

  return match(
    () => <p>Dataset not found</p>,
    (dataset: DataverseItemDetails) => (
      <PageTemplate data={dataset} metadata={datasetGeneralMetadata} tags={metadata.tags} />
    )
  )(dataset)
}

export default Dataset
