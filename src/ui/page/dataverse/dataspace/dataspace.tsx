import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Option } from 'fp-ts/Option'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import type { DataSpace, DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import type { ItemGeneralMetadata } from '@/ui/view/dataverse/types'
import PageTemplate from '@/ui/view/dataverse/component/pageTemplate/pageTemplate'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/lib/function'

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

const Dataspace = (): JSX.Element => {
  const { id } = useParams<string>()
  const [dataspace, setDataspace] = useState<Option<DataSpace>>(O.none)

  useEffect(() => {
    pipe(O.fromNullable(id), O.flatMap(getResourceDetails), O.filter(isDataSpace), setDataspace)
  }, [id])

  return O.match(
    () => <p>Dataspace not found</p>,
    (dataspace: DataSpace) => <PageTemplate data={dataspace} metadata={dataspaceMetadata} />
  )(dataspace)
}

export default Dataspace
