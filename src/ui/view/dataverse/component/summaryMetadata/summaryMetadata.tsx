import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/Array'
import { CopyToClipboard } from '@/ui/component/copyToClipboard/copyToClipboard'
import { Link } from 'react-router-dom'
import type { ItemGeneralMetadata } from '../../types'
import './summaryMetadata.scss'

type SummaryMetadataProps = {
  metadata: ItemGeneralMetadata[]
}

type MetadataRowProps = {
  label: string
  value: string
}

const originsProperties = [
  'publisher',
  'creator',
  'registrar',
  'provider',
  'belongsTo',
  'id'
] as const

type OriginsProperty = (typeof originsProperties)[number]

const isOriginsProperty = (
  metadata: ItemGeneralMetadata
): metadata is Omit<ItemGeneralMetadata, 'value'> & { value: string } =>
  originsProperties.includes(metadata.property as OriginsProperty)

const isAuditMetadata = (
  metadata: ItemGeneralMetadata
): metadata is Omit<ItemGeneralMetadata, 'value'> & { value: string } =>
  metadata.category === 'auditMetadata'

const MetadataRow = ({ label, value }: MetadataRowProps): JSX.Element => {
  const { t } = useTranslation('metadata')
  const hasClipboard = label === 'registrar' || label === 'createdBy' || label === 'modifiedBy'

  return (
    <div
      className={classNames('okp4-dataverse-portal-metadata-clipboard-container', {
        'created-by': label === 'createdBy'
      })}
    >
      <p className="okp4-dataverse-portal-metadata-label">{t(`metadata.${label}`)}</p>
      {label === 'belongsTo' ? (
        <Link className="okp4-dataverse-portal-metadata-link-value" to="/dataverse/dataspace/1">
          {value}
        </Link>
      ) : (
        <p className="okp4-dataverse-portal-metadata-value">{value}</p>
      )}
      {hasClipboard && <CopyToClipboard textToCopy={value} />}
    </div>
  )
}

export const SummaryMetadata = ({ metadata }: SummaryMetadataProps): JSX.Element => {
  const originsMetadata = pipe(metadata, A.filter(isOriginsProperty))
  const auditMetadata = pipe(metadata, A.filter(isAuditMetadata))
  return (
    <div className="okp4-dataverse-portal-summary-metadata-main">
      <div className="okp4-dataverse-portal-summary-metadata-origins">
        {originsMetadata.map(({ property, value }) => {
          return <MetadataRow key={`${property} ${value}`} label={property} value={value} />
        })}
      </div>
      <div className="okp4-dataverse-portal-summary-metadata-audit">
        {auditMetadata.map(({ property, value }) => (
          <MetadataRow key={`${property} ${value}`} label={property} value={value} />
        ))}
      </div>
    </div>
  )
}
