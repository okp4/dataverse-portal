import { useTranslation } from 'react-i18next'
import { pipe } from 'fp-ts/lib/function'
import * as A from 'fp-ts/Array'
import { CopyToClipboard } from '@/ui/component/copyToClipboard/copyToClipboard'
import type { ItemGeneralMetadata } from '@/ui/view/dataverse/types'
import './summaryMetadata.scss'
import './i18n/index'

type SummaryMetadataProps = {
  metadata: ItemGeneralMetadata[]
}

type MetadataRowProps = {
  label: string
  value: string
}

const originsProperties = ['publisher', 'creator', 'registrar', 'provider', 'id'] as const

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
    <div className="okp4-dataverse-portal-metadata-clipboard-with-toast">
      <div className="okp4-dataverse-portal-metadata-clipboard-container">
        <p className="okp4-dataverse-portal-metadata-label">{t(`${label}`)}</p>
        <p className="okp4-dataverse-portal-metadata-value">{value}</p>
        {hasClipboard && <CopyToClipboard textToCopy={value} />}
      </div>
    </div>
  )
}

export const SummaryMetadata = ({ metadata }: SummaryMetadataProps): JSX.Element => {
  const { t } = useTranslation('metadata')
  const originsMetadata = pipe(metadata, A.filter(isOriginsProperty))
  const auditMetadata = pipe(metadata, A.filter(isAuditMetadata))

  return (
    <div className="okp4-dataverse-portal-summary-metadata-main">
      <div className="okp4-dataverse-portal-summary-metadata-origins">
        {originsMetadata.map(({ property, value }) => (
          <MetadataRow key={`${property} ${value}`} label={property} value={value} />
        ))}
      </div>
      <div className="okp4-dataverse-portal-summary-metadata-audit">
        <h3 className="okp4-dataverse-portal-summary-metadata-audit-title">{t('metadata')}</h3>
        {auditMetadata.map(({ property, value }) => (
          <MetadataRow key={`${property} ${value}`} label={property} value={value} />
        ))}
      </div>
    </div>
  )
}
