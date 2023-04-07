import type { FC } from 'react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/lib/function'
import { fromPredicate } from 'fp-ts/lib/Either'
import { Icon } from '@/ui/component/icon/icon'
import type { IconName } from '@/ui/component/icon/icon'
import { useLocalizedDateIfISODateTime } from '@/ui/hook/useLocalizedYearIfISODateTime'
import type { ItemGeneralMetadata } from '@/ui/view/dataverse/types'
import './generalMetadata.scss'
import './i18n/index'

type GeneralMetadataItemProps = Omit<ItemGeneralMetadata, 'category'> & { label: string }

const propertyIcons: Record<string, IconName | undefined> = {
  topic: 'folder',
  category: 'folder',
  format: 'file',
  license: 'shield',
  geographicalCoverage: 'earth',
  temporalCoverage: 'calendar'
}

const GeneralMetadataItem: FC<GeneralMetadataItemProps> = memo(({ label, property, value }) => (
  <div className="okp4-dataverse-portal-general-metadata-item-main">
    <div className="okp4-dataverse-portal-general-metadata-item-icon">
      <Icon name={propertyIcons[property] ?? 'folder'} />
    </div>
    <div className="okp4-dataverse-portal-general-metadata-item-content">
      <h3 className="okp4-dataverse-portal-general-metadata-item-title">{label}</h3>
      <p className="okp4-dataverse-portal-general-metadata-item-description">{value}</p>
    </div>
  </div>
))
GeneralMetadataItem.displayName = 'GeneralMetadataItem'

type GeneralMetadataListProps = {
  metadata: (Omit<ItemGeneralMetadata, 'value'> & {
    value: string
  })[]
}

export const GeneralMetadataList: FC<GeneralMetadataListProps> = ({ metadata }) => {
  const namespace = 'generalMetadata'
  const { t, i18n } = useTranslation(namespace)
  const convertValueToLocalizedDateIfISODateTime = useLocalizedDateIfISODateTime(
    t('generalMetadata.invalidDate')
  )

  return (
    <div className="okp4-dataverse-portal-general-metadata-list-main">
      {metadata.map(({ value, property }) => {
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
          property === 'period' ? convertValueToLocalizedDateIfISODateTime(value) : translatedValue
        return (
          <GeneralMetadataItem
            key={property}
            label={t(`${namespace}.${property}.property`)}
            property={property}
            value={formattedValue}
          />
        )
      })}
    </div>
  )
}
