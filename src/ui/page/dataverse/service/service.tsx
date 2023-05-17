import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Option } from 'fp-ts/Option'
import { match, none } from 'fp-ts/Option'
import { NotFoundError } from '@/ui/page/error/notFoundError/notFoundError'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import type { ItemGeneralMetadata } from '@/ui/view/dataverse/types'
import PageTemplate from '@/ui/view/dataverse/component/pageTemplate/pageTemplate'

const serviceGeneralMetadata: ItemGeneralMetadata[] = [
  {
    category: 'generalMetadata',
    property: 'category',
    value: 'Data transformation'
  },
  {
    category: 'generalMetadata',
    property: 'tags',
    value: ['Regroupement', 'Traitement de données']
  },
  {
    category: 'generalMetadata',
    property: 'publisher',
    value: 'OKP4'
  },
  {
    category: 'generalMetadata',
    property: 'creator',
    value: 'OKP4'
  },
  {
    category: 'generalMetadata',
    property: 'registrar',
    value: 'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655'
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

const Service = (): JSX.Element => {
  const { id } = useParams<string>()
  const [service, setService] = useState<Option<DataverseItemDetails>>(none)

  useEffect(() => {
    id && setService(getResourceDetails(id))
  }, [id])

  return match(
    () => <NotFoundError />,
    (service: DataverseItemDetails) => (
      <PageTemplate data={service} metadata={serviceGeneralMetadata} />
    )
  )(service)
}

export default Service
