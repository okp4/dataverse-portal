import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Option } from 'fp-ts/Option'
import { match, none } from 'fp-ts/Option'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import type { MetadataProperty } from '@/ui/view/dataverse/component/generalMetadata/generalMetadata'
import { GeneralMetadataList } from '@/ui/view/dataverse/component/generalMetadata/generalMetadata'

const serviceGeneralMetadata: MetadataProperty[] = [
  {
    iconName: 'folder',
    property: 'category',
    value: 'Data transformation'
  }
]

const Service = (): JSX.Element => {
  const { id } = useParams<string>()
  const [service, setService] = useState<Option<DataverseItemDetails>>(none)

  useEffect(() => {
    id && setService(getResourceDetails(id))
  }, [id])

  return match(
    () => <p>Service not found</p>,
    (service: DataverseItemDetails) => (
      <>
        <p>{service.label}</p>
        <GeneralMetadataList metadata={serviceGeneralMetadata} />
      </>
    )
  )(service)
}

export default Service
