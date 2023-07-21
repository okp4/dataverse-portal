/* eslint-disable max-lines-per-function */
import { useEffect, useMemo, useCallback, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as IOO from 'fp-ts/IOOption'
import * as IOE from 'fp-ts/IOEither'
import * as S from 'fp-ts/string'
import * as A from 'fp-ts/Array'
import { apply, flow, pipe } from 'fp-ts/lib/function'
import type {
  FormItem,
  FormItemType,
  FormItemValue,
  initFormPayload
} from '@/ui/store/slice/shareData/shareData.slice'
import { useAppStore } from '@/ui/store'
import type { ResourceError } from '@/shared/error'
import { ShowFileError } from '@/shared/error'
import { Field } from '@/ui/component/field/field'
import type { NotificationType } from '@/ui/component/notification/notification'
import { useDispatchNotification } from '@/ui/hook/useDispatchNotification'
import { TagsField } from '@/ui/view/tagsField/tagsField'
import { DropDown } from '@/ui/view/share/data/dropDown/dropDown'
import './metadataFilling.scss'

type DatasetFormItem = {
  id: string
  type: FormItemType
  label: string
  value: FormItemValue
  render: () => JSX.Element
  required?: boolean
  style?: {
    side?: 'left' | 'right'
    inRow?: boolean
  }
}

type DatasetForm = DatasetFormItem[]

type NotificationData = {
  title: string
  type: NotificationType
}

const formErrorData = (error: ResourceError): NotificationData => {
  switch (error._tag) {
    case 'resource-not-found':
    case 'resource-already-exists':
      return {
        title: 'notification:error.problem',
        type: 'error'
      }
  }
}

const licenseOptions: string[] = [
  'CC-BY-4_0',
  'CC-BY-NC-4_0',
  'CC-BY-SA-4_0',
  'CC0-1_0',
  'LO-FR-1_0',
  'LO-FR-2_0',
  'ODC-BY-1_0',
  'ODbL-1_0',
  'OGL-Canada-2_0',
  'OGL-UK-1_0',
  'OGL-UK-2_0',
  'OGL-UK-3_0',
  'PDDL-1_0',
  'dli-model-use',
  'geogratis'
]

const formatOptions: string[] = [
  'CSV',
  'JPEG image',
  'Microsoft Excel spreadsheet',
  'Microsoft PowerPoint presentation',
  'Microsoft Word document',
  'MPEG video',
  'MP3 audio',
  'PDF document',
  'README document'
]

const geographicalCoverageOptions: string[] = [
  'Africa',
  'Americas',
  'Asia',
  'Benin',
  'China, Hong Kong Special Administrative Region',
  'Europe',
  'Finland',
  'France',
  'Germany',
  'Italy',
  'Japan',
  'Oceania',
  'Russian Federation',
  'Senegal',
  'Spain',
  'United Kingdom of Great Britain and Northern Ireland',
  'United States of America',
  'World'
]

const topicOptions: string[] = [
  'Agriculture, food, environment and forestry',
  'Biology, geology and chemistry',
  'Business and purchase',
  'DeFi and Crypto',
  'Energy',
  'Health',
  'Industry, mobility and engineering',
  'Logistics, retail, supply chain and eCommerce',
  'Marketing and Customer Behavior',
  'Other'
]

export const MetadataFilling: FC = () => {
  const { t } = useTranslation('share')
  const dispatchNotification = useDispatchNotification()
  const { initForm, setFormItemValue, formItemById, isFormInitialized } = useAppStore(state => ({
    initForm: state.shareData.initForm,
    setFormItemValue: state.shareData.setFormItemValue,
    formItemById: state.shareData.formItemById,
    isFormInitialized: state.shareData.isFormInitialized
  }))

  const formSides = ['left', 'right']

  const handleFieldValueChange = useCallback(
    (id: string) => (value: string) => {
      setFormItemValue({ id, value })()
    },
    [setFormItemValue]
  )

  const selectValue = useCallback(
    (id: string): string[] =>
      flow(
        formItemById,
        IOO.map(({ value }: FormItem) => value),
        IOO.flatMap(IOO.fromPredicate(Array.isArray)),
        IOO.getOrElseW(() => () => []),
        apply(null)
      )(id),
    [formItemById]
  )

  const onSelectChange = useCallback(
    (id: string) => (value: string[]) => {
      setFormItemValue({ id, value })()
    },
    [setFormItemValue]
  )

  const addTag = useCallback(
    (id: string) => (value: string) => {
      setFormItemValue({ id, value: A.append(value)(selectValue(id)) })()
    },
    [setFormItemValue, selectValue]
  )

  const removeTag = useCallback(
    (id: string) => (value: string) => {
      const filterPredicate = (tag: string): boolean => tag !== value
      setFormItemValue({ id, value: A.filter(filterPredicate)(selectValue(id)) })()
    },
    [setFormItemValue, selectValue]
  )

  const formItemFieldValue = useCallback(
    (id: string): string =>
      flow(
        formItemById,
        IOO.map(({ value }: FormItem) => value),
        IOO.flatMap(IOO.fromPredicate(S.isString)),
        IOO.getOrElse(() => () => ''),
        apply(null)
      )(id),
    [formItemById]
  )

  const datasetForm: DatasetForm = useMemo((): DatasetForm => {
    const id1 = 'input-field-1'
    const id2 = 'input-field-2'
    const id3 = 'input-field-3'
    const id4 = 'input-field-4'
    const id5 = 'input-field-5'
    const id6 = 'input-field-6'
    const id7 = 'input-field-7'
    const id8 = 'input-field-8'
    const id9 = 'input-field-9'
    const id10 = 'input-field-10'
    return [
      {
        id: id1,
        type: 'text',
        label: 'title',
        value: '',
        required: true,
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling" key={id1}>
            <Field
              id={id1}
              label={t('share.metadataFilling.datasetTitle')}
              onChange={handleFieldValueChange(id1)}
              required
              value={formItemFieldValue(id1)}
            />
          </div>
        ),
        style: {
          side: 'left'
        }
      },
      {
        id: id2,
        type: 'text',
        label: 'publisher',
        value: '',
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling publisher" key={id2}>
            <Field
              id={id2}
              label={t('share.metadataFilling.publisher')}
              onChange={handleFieldValueChange(id2)}
              value={formItemFieldValue(id2)}
            />
          </div>
        ),
        style: {
          side: 'left',
          inRow: true
        }
      },
      {
        id: id3,
        type: 'text',
        label: 'creator',
        value: '',
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling creator" key={id3}>
            <Field
              id={id3}
              label={t('share.metadataFilling.creator')}
              onChange={handleFieldValueChange(id3)}
              value={formItemFieldValue(id3)}
            />
          </div>
        ),
        style: {
          side: 'left',
          inRow: true
        }
      },
      {
        id: id4,
        type: 'text',
        label: 'description',
        value: '',
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling description" key={id4}>
            <Field
              id={id4}
              label={t('share.metadataFilling.description')}
              multiline
              onChange={handleFieldValueChange(id4)}
              value={formItemFieldValue(id4)}
            />
          </div>
        ),
        style: {
          side: 'left'
        }
      },
      {
        id: id5,
        type: 'text',
        label: 'format',
        value: [],
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling" key={id5}>
            <p>{t('share.metadataFilling.format')}</p>
            <DropDown
              onChange={onSelectChange(id5)}
              options={formatOptions}
              placeholder={t('share.metadataFilling.formatSelection')}
              searchPlaceholder={t('share.metadataFilling.formatSearch')}
              selectionType="checkbox"
              value={selectValue(id5)}
            />
          </div>
        ),
        style: {
          side: 'left'
        }
      },
      {
        id: id6,
        type: 'text',
        label: 'license',
        value: [],
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling" key={id6}>
            <p>{t('share.metadataFilling.license')}</p>
            <DropDown
              onChange={onSelectChange(id6)}
              options={licenseOptions}
              placeholder={t('share.metadataFilling.licenseSelection')}
              searchPlaceholder={t('share.metadataFilling.licenseSearch')}
              selectionType="checkbox"
              value={selectValue(id6)}
            />
          </div>
        ),
        style: {
          side: 'left'
        }
      },
      {
        id: id7,
        type: 'text',
        label: 'topic',
        value: [],
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling" key={id7}>
            <p>{t('share.metadataFilling.topic')}</p>
            <DropDown
              onChange={onSelectChange(id7)}
              options={topicOptions}
              placeholder={t('share.metadataFilling.topicSelection')}
              searchPlaceholder={t('share.metadataFilling.topicSearch')}
              selectionType="checkbox"
              value={selectValue(id7)}
            />
          </div>
        ),
        style: {
          side: 'right'
        }
      },
      {
        id: id8,
        type: 'text',
        label: 'geographicalCoverage',
        value: [],
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling" key={id8}>
            <p>{t('share.metadataFilling.geographicalCoverage')}</p>
            <DropDown
              onChange={onSelectChange(id8)}
              options={geographicalCoverageOptions}
              placeholder={t('share.metadataFilling.geographicalCoverageSelection')}
              searchPlaceholder={t('share.metadataFilling.geographicalCoverageSearch')}
              selectionType="checkbox"
              value={selectValue(id8)}
            />
          </div>
        ),
        style: {
          side: 'right'
        }
      },
      {
        id: id9,
        type: 'select',
        label: 'tags',
        value: [],
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling" key={id9}>
            <p>{t('share.metadataFilling.tags')}</p>
            <TagsField addTag={addTag(id9)} removeTag={removeTag(id9)} tags={selectValue(id9)} />
          </div>
        ),
        style: {
          side: 'right'
        }
      },
      {
        id: id10,
        type: 'text',
        label: 'fee',
        value: 0,
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling fee" key={id10}>
            <Field
              id={id10}
              label={'fee'}
              onChange={handleFieldValueChange(id10)}
              value={formItemFieldValue(id10)}
            />
          </div>
        ),
        style: {
          side: 'right'
        }
      }
    ]
  }, [
    t,
    handleFieldValueChange,
    formItemFieldValue,
    onSelectChange,
    selectValue,
    addTag,
    removeTag
  ])

  const mapForm = (form: DatasetForm): initFormPayload => {
    return form.map(formItem => ({
      id: formItem.id,
      type: formItem.type,
      label: formItem.label,
      value: formItem.value,
      required: formItem.required
    }))
  }

  const handleFormError = useCallback(
    (error: ResourceError) => {
      const { title, type } = formErrorData(error)
      console.error(ShowFileError.show(error))
      dispatchNotification({
        type: type,
        titleKey: title
      })
    },
    [dispatchNotification]
  )
  useEffect(() => {
    if (!isFormInitialized()()) {
      const initialForm = mapForm(datasetForm)
      pipe(initialForm, initForm, IOE.mapLeft(handleFormError))()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetForm, initForm, isFormInitialized])

  return (
    <div className="okp4-dataverse-portal-share-data-metadata-filling-container">
      <h2>{t('share.metadataFilling.stepTitle')}</h2>

      <div className="okp4-dataverse-portal-share-data-metadata-filling-description">
        <h3>{t('share.metadataFilling.stepDescription')}</h3>
      </div>
      <div className="okp4-dataverse-portal-share-data-metadata-filling-form-container">
        {formSides.map(side => (
          <div
            className={`okp4-dataverse-portal-share-data-metadata-filling-form-part ${side}`}
            key={side}
          >
            {datasetForm.map(formItem => formItem.style?.side === side && formItem.render())}
          </div>
        ))}
      </div>
    </div>
  )
}
