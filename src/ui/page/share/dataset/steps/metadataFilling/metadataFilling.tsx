/* eslint-disable max-lines-per-function */
import { useEffect, useMemo, useCallback, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import uuid from 'short-uuid'
import * as O from 'fp-ts/Option'
import type {
  Form,
  FormItem,
  FormItemType,
  FormItemValue
} from '@/ui/store/slice/shareData/shareData.slice'
import { useAppStore } from '@/ui/store'
import './metadataFilling.scss'
import { Field } from '@/ui/component/field/field'

type DatasetFormItem = {
  id: string
  type: FormItemType
  label: string
  value: FormItemValue
  side: 'left' | 'right'
  renderFormItem: (id: string) => JSX.Element
  required?: boolean
}

type DatasetForm = DatasetFormItem[]

export const MetadataFilling: FC = () => {
  const { t } = useTranslation('share')
  const { initForm, setFormItemValue, formItemById } = useAppStore(state => ({
    initForm: state.shareData.initForm,
    setFormItemValue: state.shareData.setFormItemValue,
    formItemById: state.shareData.formItemById
  }))

  const formSides = ['left', 'right']

  const handleChange = useCallback(
    (id: string) => (value: string) => {
      setFormItemValue({ id, value })()
    },
    [setFormItemValue]
  )

  const datasetForm: DatasetForm = useMemo(
    () => [
      {
        id: uuid.generate(),
        type: 'text',
        label: 'title',
        value: '',
        required: true,
        side: 'left',
        renderFormItem: (id): JSX.Element => {
          return (
            <div className="okp4-dataverse-portal-share-data-metadata-filling">
              <Field
                id={id}
                label={t('share.metadataFilling.datasetTitle')}
                onChange={handleChange(id)}
                required
                value={O.match(
                  () => '',
                  (it: FormItem) => it.value as string
                )(formItemById(id)())}
              />
            </div>
          )
        }
      },
      {
        id: uuid.generate(),
        type: 'text',
        label: 'publisher',
        value: '',
        side: 'left',
        inRow: true,
        renderFormItem: (id): JSX.Element => {
          return (
            <div className="okp4-dataverse-portal-share-data-metadata-filling publisher">
              <Field
                id={id}
                label={t('share.metadataFilling.publisher')}
                onChange={handleChange(id)}
                value={O.match(
                  () => '',
                  (it: FormItem) => it.value as string
                )(formItemById(id)())}
              />
            </div>
          )
        }
      },
      {
        id: uuid.generate(),
        type: 'text',
        label: 'creator',
        value: '',
        side: 'left',
        inRow: true,
        renderFormItem: (id): JSX.Element => {
          return (
            <div className="okp4-dataverse-portal-share-data-metadata-filling creator">
              <Field
                id={id}
                label={t('share.metadataFilling.creator')}
                onChange={handleChange(id)}
                value={O.match(
                  () => '',
                  (it: FormItem) => it.value as string
                )(formItemById(id)())}
              />
            </div>
          )
        }
      },
      {
        id: uuid.generate(),
        type: 'text',
        label: 'description',
        value: '',
        side: 'left',
        renderFormItem: (id): JSX.Element => {
          return (
            <div className="okp4-dataverse-portal-share-data-metadata-filling description">
              <Field
                id={id}
                label={t('share.metadataFilling.description')}
                multiline
                onChange={handleChange(id)}
                value={O.match(
                  () => '',
                  (it: FormItem) => it.value as string
                )(formItemById(id)())}
              />
            </div>
          )
        }
      },
      {
        id: uuid.generate(),
        type: 'text',
        label: 'format',
        value: [],
        side: 'left',
        renderFormItem: (id): JSX.Element => {
          return (
            <div className="okp4-dataverse-portal-share-data-metadata-filling">
              <p>{t('share.metadataFilling.format')}</p>
              <Field
                id={id}
                label={t('share.metadataFilling.formatSelection')}
                onChange={handleChange(id)}
                value={O.match(
                  () => '',
                  (it: FormItem) => it.value as string
                )(formItemById(id)())}
              />
            </div>
          )
        }
      },
      {
        id: uuid.generate(),
        type: 'text',
        label: 'license',
        value: [],
        side: 'left',
        renderFormItem: (id): JSX.Element => {
          return (
            <div className="okp4-dataverse-portal-share-data-metadata-filling">
              <p>{t('share.metadataFilling.license')}</p>
              <Field
                id={id}
                label={t('share.metadataFilling.licenceSelection')}
                onChange={handleChange(id)}
                value={O.match(
                  () => '',
                  (it: FormItem) => it.value as string
                )(formItemById(id)())}
              />
            </div>
          )
        }
      },
      {
        id: uuid.generate(),
        type: 'text',
        label: 'topic',
        value: [],
        side: 'right',
        renderFormItem: (id): JSX.Element => {
          return (
            <div className="okp4-dataverse-portal-share-data-metadata-filling">
              <p>{t('share.metadataFilling.topic')}</p>
              <Field
                id={id}
                label={t('share.metadataFilling.topicSelection')}
                onChange={handleChange(id)}
                value={O.match(
                  () => '',
                  (it: FormItem) => it.value as string
                )(formItemById(id)())}
              />
            </div>
          )
        }
      },
      {
        id: uuid.generate(),
        type: 'text',
        label: 'geographicalCoverage',
        value: [],
        side: 'right',
        renderFormItem: (id): JSX.Element => {
          return (
            <div className="okp4-dataverse-portal-share-data-metadata-filling">
              <p>{t('share.metadataFilling.geographicalCoverage')}</p>
              <Field
                id={id}
                label={t('share.metadataFilling.geographicalCoverageSelection')}
                onChange={handleChange(id)}
                value={O.match(
                  () => '',
                  (it: FormItem) => it.value as string
                )(formItemById(id)())}
              />
            </div>
          )
        }
      },
      {
        id: uuid.generate(),
        type: 'text',
        label: 'tags',
        value: [],
        side: 'right',
        renderFormItem: (id): JSX.Element => {
          return (
            <div className="okp4-dataverse-portal-share-data-metadata-filling">
              <p>{t('share.metadataFilling.tags')}</p>
              <Field
                id={id}
                label={'tags'}
                onChange={handleChange(id)}
                value={O.match(
                  () => '',
                  (it: FormItem) => it.value as string
                )(formItemById(id)())}
              />
            </div>
          )
        }
      },
      {
        id: uuid.generate(),
        type: 'text',
        label: 'fee',
        value: 0,
        side: 'right',
        renderFormItem: (id): JSX.Element => {
          return (
            <div className="okp4-dataverse-portal-share-data-metadata-filling fee">
              <Field
                id={id}
                label={'fee'}
                onChange={handleChange(id)}
                value={O.match(
                  () => '',
                  (it: FormItem) => it.value as string
                )(formItemById(id)())}
              />
            </div>
          )
        }
      }
    ],
    [formItemById, handleChange, t]
  )

  const mapForm = (form: DatasetForm): Form => {
    return form.map(formItem => ({
      id: formItem.id,
      type: formItem.type,
      label: formItem.label,
      value: formItem.value,
      required: formItem.required
    }))
  }

  useEffect(() => {
    const initialForm = mapForm(datasetForm)
    initForm(initialForm)()
  }, [datasetForm, initForm])

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
            {datasetForm.map(
              formItem => formItem.side === side && formItem.renderFormItem(formItem.id)
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
