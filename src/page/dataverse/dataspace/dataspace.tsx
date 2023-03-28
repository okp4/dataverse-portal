import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getResourceDetails } from '../dataverse'
import type { DataverseItemDetails } from '../dataverse'

const Dataspace = (): JSX.Element => {
  const { id } = useParams<string>()
  const [dataspace, setDataspace] = useState<DataverseItemDetails | undefined>()

  useEffect(() => {
    id && setDataspace(getResourceDetails(id))
  }, [id])
  return dataspace ? <p>{dataspace.label}</p> : <p>Dataspace not found</p>
}

export default Dataspace
