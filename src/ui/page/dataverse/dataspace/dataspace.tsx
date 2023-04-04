import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Option } from 'fp-ts/Option'
import { match, none } from 'fp-ts/Option'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import type { Metadata } from '@/ui/view/dataverse/types'
import PageTemplate from '@/ui/view/dataverse/component/pageTemplate/pageTemplate'

const dataspaceMetadata: Metadata[] = [
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

const Dataspace = (): JSX.Element => {
  const { id } = useParams<string>()
  const [dataspace, setDataspace] = useState<Option<DataverseItemDetails>>(none)

  useEffect(() => {
    id && setDataspace(getResourceDetails(id))
  }, [id])

  return match(
    () => <p>Dataspace not found</p>,
    (dataspace: DataverseItemDetails) => (
      <PageTemplate data={dataspace} metadata={dataspaceMetadata} />
    )
  )(dataspace)
}

export default Dataspace
