import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Option } from 'fp-ts/Option'
import { match, none } from 'fp-ts/Option'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import type { GeneralMetadata } from '@/page/dataverse/component/generalMetadata/generalMetadata'
import { GeneralMetadataList } from '@/page/dataverse/component/generalMetadata/generalMetadata'

const dataspaceGeneralMetadata: GeneralMetadata[] = [
  {
    iconName: 'folder',
    title: 'topic',
    description: 'Agriculture Environment And Forestry'
  }
]

type MatchedDataspaceProps = {
  label: string
}
const MatchedDataspace: FC<MatchedDataspaceProps> = ({ label }) => (
  <>
    <p>{label}</p>
    <GeneralMetadataList metadata={dataspaceGeneralMetadata} />
  </>
)

const Dataspace = (): JSX.Element => {
  const { id } = useParams<string>()
  const [dataspace, setDataspace] = useState<Option<DataverseItemDetails>>(none)

  useEffect(() => {
    id && setDataspace(getResourceDetails(id))
  }, [id])

  return match(
    () => <p>Dataspace not found</p>,
    (dataspace: DataverseItemDetails) => <MatchedDataspace label={dataspace.label} />
  )(dataspace)
}

export default Dataspace
