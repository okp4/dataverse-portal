import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Option } from 'fp-ts/Option'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/lib/function'
import type { DataSpace, Governance as DataSpaceGovernance } from '@/ui/page/dataverse/dataverse'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import { isDataSpace } from '@/ui/page/dataverse/dataspace/dataspace'
import { BackButton } from '@/ui/view/dataverse/component/backButton/backButton'

const dataspaceGovernance = (dataSpace: DataSpace): Option<DataSpaceGovernance> =>
  O.some(dataSpace.governance)

const Governance = (): JSX.Element => {
  const { id } = useParams<string>()
  const [governance, setGovernance] = useState<Option<DataSpaceGovernance>>(O.none)

  useEffect(() => {
    pipe(
      O.fromNullable(id),
      O.chain(getResourceDetails),
      O.filter(isDataSpace),
      O.chain(dataspaceGovernance),
      setGovernance
    )
  }, [id])

  return O.match(
    () => <p>governance not found</p>,
    (governance: DataSpaceGovernance) => (
      <div className="">
        {/* id should be imbedded in the argument object */}
        <BackButton to={`/dataverse/dataspace/${id}`} />
      </div>
    )
  )(governance)
}

export default Governance
