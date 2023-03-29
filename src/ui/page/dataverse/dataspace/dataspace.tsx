import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Option } from 'fp-ts/Option'
import { match, none } from 'fp-ts/Option'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import type { GeneralMetadata } from '@/component/generalMetadata/generalMetadata'
import { GeneralMetadataList } from '@/component/generalMetadata/generalMetadata'

const dataspaceGeneralMetadata: GeneralMetadata[] = [
  {
    iconName: 'topic',
    titleKey: 'topic',
    description: 'Agriculture Environment And Forestry'
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
    (dataspace: DataverseItemDetails) => {
      return (
        <>
          <p>{dataspace.label}</p>
          <GeneralMetadataList metadata={dataspaceGeneralMetadata} />
        </>
      )
    }
  )(dataspace)
}

export default Dataspace
