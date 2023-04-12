import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Option } from 'fp-ts/Option'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/lib/function'
import type { DataverseItemDetails } from '@/ui/page/dataverse/dataverse'
import { getResourceDetails } from '@/ui/page/dataverse/dataverse'
import { isDataSpace } from '@/ui/page/dataverse/dataspace/dataspace'
import { BackButton } from '@/ui/view/dataverse/component/backButton/backButton'
import './governance.scss'

const Governance = (): JSX.Element => {
  const { id } = useParams<string>()
  const [dataverseItem, setDataverseItem] = useState<Option<DataverseItemDetails>>(O.none)

  useEffect(() => {
    pipe(O.fromNullable(id), O.chain(getResourceDetails), O.filter(isDataSpace), setDataverseItem)
  }, [id])

  return O.match(
    () => <p>dataverse item not found</p>,
    (dataverseItem: DataverseItemDetails) => {
      const { label } = dataverseItem
      // TODO: add governance translation for title
      return (
        <div className="okp4-dataverse-portal-governance-page-main">
          <div className="okp4-dataverse-portal-governance-page-back-button">
            {/* id should be imbedded in the argument object */}
            <BackButton to={`/dataverse/dataspace/${id}`} />
          </div>
          <section className="okp4-dataverse-portal-governance-page-section">
            <h1>{`${label} | governance`}</h1>
          </section>
        </div>
      )
    }
  )(dataverseItem)
}

export default Governance
