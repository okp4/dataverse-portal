import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getResourceDetails } from '../dataverse'
import type { DataverseItemDetails } from '../dataverse'

const Service = (): JSX.Element => {
  const { id } = useParams<string>()
  const [service, setService] = useState<DataverseItemDetails | undefined>()

  useEffect(() => {
    id && setService(getResourceDetails(id))
  }, [id])
  return service ? <p>{service.label}</p> : <p>Service not found</p>
}

export default Service
