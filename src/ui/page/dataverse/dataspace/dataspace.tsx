import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Option } from 'fp-ts/Option'
import { match, none } from 'fp-ts/Option'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import type { MetadataProperty } from '@/ui/view/dataverse/component/generalMetadata/generalMetadata'
import PageTemplate from '@/ui/view/dataverse/component/pageTemplate/pageTemplate'

const dataspaceGeneralMetadata: MetadataProperty[] = [
  {
    iconName: 'folder',
    property: 'topic',
    value: 'Agriculture Environment And Forestry'
  }
]

const Dataspace = (): JSX.Element => {
  const { id } = useParams<string>()
  const [dataspace, setDataspace] = useState<Option<DataverseItemDetails>>(none)

  const metadata = {
    tags: ['Agriculture', 'Open data', 'Dataviz']
  }

  useEffect(() => {
    id && setDataspace(getResourceDetails(id))
  }, [id])

  return match(
    () => <p>Dataspace not found</p>,
    (dataspace: DataverseItemDetails) => (
      <PageTemplate data={dataspace} metadata={dataspaceGeneralMetadata} tags={metadata.tags} />
    )
  )(dataspace)
}

export default Dataspace
