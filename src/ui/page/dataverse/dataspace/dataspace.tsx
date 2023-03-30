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
    iconName: 'folder',
    property: 'topic',
    value: 'Agriculture Environment And Forestry'
  },
  {
    property: 'tags',
    value: ['Agriculture', 'Open data', 'Dataviz']
  }
]

export const isDataSpace = (resource: DataverseItemDetails): resource is DataSpace =>
  resource.type === 'dataspace'

const Dataspace = (): JSX.Element => {
  const { id } = useParams<string>()
  const [dataspace, setDataspace] = useState<Option<DataSpace>>(O.none)

  useEffect(() => {
    const convertToDataSpace = (resource: Option<DataverseItemDetails>): Option<DataSpace> =>
      pipe(
        resource,
        O.filterMap<DataverseItemDetails, DataSpace>(value =>
          value.type === 'dataspace' ? O.some(value as DataSpace) : O.none
        )
      )
    id && setDataspace(pipe(id, getResourceDetails, convertToDataSpace))
  }, [id])

  return O.match(
    () => <p>Dataspace not found</p>,
    (dataspace: DataSpace) => <PageTemplate data={dataspace} metadata={dataspaceMetadata} />
  )(dataspace)
}

export default Dataspace
