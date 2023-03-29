import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Option } from 'fp-ts/Option'
import { match, none } from 'fp-ts/Option'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'

const Dataspace = (): JSX.Element => {
  const { id } = useParams<string>()
  const [dataspace, setDataspace] = useState<Option<DataverseItemDetails>>(none)

  useEffect(() => {
    id && setDataspace(getResourceDetails(id))
  }, [id])

  return match(
    () => <p>Dataspace not found</p>,
    (dataspace: DataverseItemDetails) => <p>{dataspace.label}</p>
  )(dataspace)
}

export default Dataspace