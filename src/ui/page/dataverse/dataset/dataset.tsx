import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Option } from 'fp-ts/Option'
import { match, none } from 'fp-ts/Option'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import type { ItemGeneralMetadata } from '@/ui/view/dataverse/types'
import PageTemplate from '@/ui/view/dataverse/component/pageTemplate/pageTemplate'

const datasetMetadata: ItemGeneralMetadata[] = [
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
  },
  {
    property: 'tags',
    value: ['Agriculture', 'France', 'Open data', 'Rendement', 'Departement', 'Superficie', 'RPG']
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
    (dataset: DataverseItemDetails) => <PageTemplate data={dataset} metadata={datasetMetadata} />
  )(dataset)
}

export default Dataset
