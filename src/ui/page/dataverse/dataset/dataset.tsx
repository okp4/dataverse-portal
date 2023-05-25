import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as O from 'fp-ts/Option'
import { NotFoundError } from '@/ui/page/error/notFoundError/notFoundError'
import { Dataset, getResourceDetails } from '@/ui/page/dataverse/dataverse'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import type { ItemGeneralMetadata } from '@/ui/view/dataverse/types'
import PageTemplate from '@/ui/view/dataverse/component/pageTemplate/pageTemplate'

const datasetMetadata: ItemGeneralMetadata[] = [
  {
    category: 'generalMetadata',
    property: 'format',
    value: 'text_csv'
  },
  {
    category: 'generalMetadata',
    property: 'topic',
    value: 'industryMobilityAndEngineering'
  },
  {
    category: 'generalMetadata',
    property: 'license',
    value: 'licence:LO-FR-2_0'
  },
  {
    category: 'generalMetadata',
    property: 'geographicalCoverage',
    value: 'France'
  },
  {
    category: 'generalMetadata',
    property: 'period',
    value: ['2022-01-01T00:00:00+00:00', '2022-12-31T00:00:00+00:00']
  },
  {
    category: 'generalMetadata',
    property: 'tags',
    value: ['Agriculture', 'France', 'Open data', 'Rendement', 'Departement', 'Superficie', 'RPG']
  },
  {
    category: 'generalMetadata',
    property: 'publisher',
    value: 'OKP4'
  },
  {
    category: 'generalMetadata',
    property: 'creator',
    value: 'IGN'
  },
  {
    category: 'generalMetadata',
    property: 'registrar',
    value: 'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655'
  },
  {
    category: 'generalMetadata',
    property: 'provider',
    value: 'https://ontology.okp4.space/metadata/service/16c4cd10-521a-4829-b1bd-a1e2ac60459a'
  },
  {
    category: 'generalMetadata',
    property: 'belongsTo',
    value: 'Rhizome'
  },
  {
    category: 'generalMetadata',
    property: 'id',
    value: 'ca752b42-9740-4436-a86f-cd3c5e084d33'
  },
  {
    category: 'auditMetadata',
    property: 'createdBy',
    value: 'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655'
  },
  {
    category: 'auditMetadata',
    property: 'createdOn',
    value: '2022-10-16T16:51:28+00:00'
  },
  {
    category: 'auditMetadata',
    property: 'modifiedBy',
    value: 'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655'
  },
  {
    category: 'auditMetadata',
    property: 'modifiedOn',
    value: '2022-10-16T16:51:28+00:00'
  }
]

const isDataSet = (resource: DataverseItemDetails): resource is Dataset =>
  resource.type === 'dataset'

const Dataset: FC = () => {
  const { id } = useParams<string>()
  const [dataset, setDataset] = useState<O.Option<DataverseItemDetails>>(O.none)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const resourceDetails = id ? getResourceDetails(id) : O.none
    setDataset(
      O.isSome(resourceDetails) && isDataSet(resourceDetails.value) ? resourceDetails : O.none
    )
    setIsLoading(false)
  }, [id])

  if (isLoading) {
    // TODO: add loading component
    return null
  }

  return O.match(
    () => <NotFoundError />,
    (dataset: DataverseItemDetails) => <PageTemplate data={dataset} metadata={datasetMetadata} />
  )(dataset)
}

export default Dataset
