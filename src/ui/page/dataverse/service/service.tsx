import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Option } from 'fp-ts/Option'
import { match, none } from 'fp-ts/Option'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import type { GeneralMetadata } from '@/page/dataverse/component/generalMetadata/generalMetadata'
import { GeneralMetadataList } from '@/page/dataverse/component/generalMetadata/generalMetadata'

const serviceGeneralMetadata: GeneralMetadata[] = [
  {
    iconName: 'folder',
    title: 'category',
    description: 'Data transformation'
  }
]

type MatchedServiceProps = {
  label: string
}
const MatchedService: FC<MatchedServiceProps> = ({ label }) => (
  <>
    <p>{label}</p>
    <GeneralMetadataList metadata={serviceGeneralMetadata} />
  </>
)

const Service = (): JSX.Element => {
  const { id } = useParams<string>()
  const [service, setService] = useState<Option<DataverseItemDetails>>(none)

  useEffect(() => {
    id && setService(getResourceDetails(id))
  }, [id])

  return match(
    () => <p>Service not found</p>,
    (service: DataverseItemDetails) => <MatchedService label={service.label} />
  )(service)
}

export default Service
