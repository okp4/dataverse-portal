import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as O from 'fp-ts/Option'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import { NotFoundError } from '@/ui/page/error/notFoundError/notFoundError'
import type { DataSpace, DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import type { ItemGeneralMetadata } from '@/ui/view/dataverse/types'
import PageTemplate from '@/ui/view/dataverse/component/pageTemplate/pageTemplate'

const dataspaceMetadata: ItemGeneralMetadata[] = [
  {
    category: 'generalMetadata',
    property: 'topic',
    value: 'Agriculture Environment And Forestry'
  },
  {
    category: 'generalMetadata',
    property: 'tags',
    value: ['Agriculture', 'Open data', 'Dataviz']
  },
  {
    category: 'generalMetadata',
    property: 'publisher',
    value: 'OKP4'
  },
  {
    category: 'generalMetadata',
    property: 'registrar',
    value: 'did:key:0x04d1f1b8f8a7a28f9a5a254c326a963a22f5a5b5d5f5e5d5c5b5a5958575655'
  },
  {
    category: 'generalMetadata',
    property: 'id',
    value: 'ef347285-e52a-430d-9679-dcb76b962ce7'
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

export const isDataSpace = (resource: DataverseItemDetails): resource is DataSpace =>
  resource.type === 'dataspace'

const Dataspace: FC = () => {
  const { id } = useParams<string>()
  const [dataspace, setDataspace] = useState<O.Option<DataverseItemDetails>>(O.none)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    setIsLoading(true)
    const resourceDetails = id ? getResourceDetails(id) : O.none
    setDataspace(
      O.isSome(resourceDetails) && isDataSpace(resourceDetails.value) ? resourceDetails : O.none
    )
    setIsLoading(false)
  }, [id])

  if (isLoading) {
    // TODO: add loading component
    return null
  }

  return O.match(
    () => <NotFoundError />,
    (dataspace: DataverseItemDetails) => (
      <PageTemplate data={dataspace} metadata={dataspaceMetadata} />
    )
  )(dataspace)
}

export default Dataspace
