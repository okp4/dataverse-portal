import type { FC } from 'react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import { fromPredicate } from 'fp-ts/lib/Either'
import { Icon } from '@/ui/component/icon/icon'
import { useLocalizedYearIfISODateTime } from '@/ui/hook/useLocalizedYearIfISODateTime'
import type { GeneralMetadata } from '@/ui/view/dataverse/types'
import './generalMetadata.scss'
import './i18n/index'

const GeneralMetadataItem: FC<GeneralMetadata> = memo(
  ({ iconName = 'folder', property, value }) => (
    <div className="okp4-dataverse-portal-general-metadata-item-main">
      <div className="okp4-dataverse-portal-general-metadata-item-icon">
        <Icon name={iconName} />
      </div>
      <div className="okp4-dataverse-portal-general-metadata-item-content">
        <h3 className="okp4-dataverse-portal-general-metadata-item-title">{property}</h3>
        <p className="okp4-dataverse-portal-general-metadata-item-description">{value}</p>
      </div>
    </div>
  )
)
GeneralMetadataItem.displayName = 'GeneralMetadataItem'

type GeneralMetadataListProps = {
  metadata: GeneralMetadata[]
}

export const GeneralMetadataList: FC<GeneralMetadataListProps> = ({ metadata }) => {
  const namespace = 'generalMetadata'
  const { t, i18n } = useTranslation(namespace)
  const convertValueToLocalizedYearIfISODateTime = useLocalizedYearIfISODateTime(
    t('generalMetadata.invalidDate')
  )

  return (
    <div className="okp4-dataverse-portal-general-metadata-list-main">
      {metadata.map(({ value, iconName, property }) => {
        const translationKeyExists = i18n.exists(`${namespace}.topic.value.${value}`, {
          ns: namespace,
          lng: i18n.language
        })
        const translatedValue = pipe(
          value,
          fromPredicate(
            () => translationKeyExists,
            () => value
          ),
          E.map(val => t(`${namespace}.${property}.value.${val}`)),
          E.getOrElse(() => value)
        )
        const formattedValue =
          property === 'temporalCoverage'
            ? convertValueToLocalizedYearIfISODateTime(value)
            : translatedValue
        return (
          <GeneralMetadataItem
            iconName={iconName}
            key={property}
            property={t(`${namespace}.${property}.property`)}
            value={formattedValue}
          />
        )
      })}
    </div>
  )
}
