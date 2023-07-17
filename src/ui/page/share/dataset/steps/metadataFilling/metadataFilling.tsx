/* eslint-disable max-lines-per-function */
import { useEffect, useMemo, useCallback, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as O from 'fp-ts/Option'
import * as IOE from 'fp-ts/IOEither'
import { pipe } from 'fp-ts/lib/function'
import type {
  FormItem,
  FormItemType,
  FormItemValue,
  initFormPayload
} from '@/ui/store/slice/shareData/shareData.slice'
import { useAppStore } from '@/ui/store'
import {
  type ResourceNotFoundError,
  type ResourceAlreadyExistsError,
  ShowFileError
} from '@/shared/error'
import { Field } from '@/ui/component/field/field'
import type { NotificationType } from '@/ui/component/notification/notification'
import { useDispatchNotification } from '@/ui/hook/useDispatchNotification'
import './metadataFilling.scss'

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

type NotificationData = {
  title: string
  type: NotificationType
}

type FormError = ResourceNotFoundError | ResourceAlreadyExistsError

const formErrorData = (error: FormError): NotificationData => {
  switch (error._tag) {
    case 'resource-not-found':
    case 'resource-already-exists':
      return {
        title: 'notification:error.problem',
        type: 'error'
      }
  }
}

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

  const handleChange = useCallback(
    (id: string) => (value: string) => {
      setFormItemValue({ id, value })()
    },
    [setFormItemValue]
  )

  const formItemValue = useCallback(
    (id: string): string =>
      O.match(
        () => '',
        (it: FormItem) => it.value as string
      )(formItemById(id)()),
    [formItemById]
  )

  const datasetForm: DatasetForm = useMemo(
    () => [
      {
        id: 'input-field-1',
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
                value={formItemValue(id)}
              />
            </div>
          )
        }
      },
      {
        id: 'input-field-2',
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
                value={formItemValue(id)}
              />
            </div>
          )
        }
      },
      {
        id: 'input-field-3',
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
                value={formItemValue(id)}
              />
            </div>
          )
        }
      },
      {
        id: 'input-field-4',
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
                value={formItemValue(id)}
              />
            </div>
          )
        }
      },
      {
        id: 'input-field-5',
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
                value={formItemValue(id)}
              />
            </div>
          )
        }
      },
      {
        id: 'input-field-6',
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
                value={formItemValue(id)}
              />
            </div>
          )
        }
      },
      {
        id: 'input-field-7',
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
                value={formItemValue(id)}
              />
            </div>
          )
        }
      },
      {
        id: 'input-field-8',
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
                value={formItemValue(id)}
              />
            </div>
          )
        }
      },
      {
        id: 'input-field-9',
        type: 'text',
        label: 'tags',
        value: [],
        side: 'right',
        renderFormItem: (id): JSX.Element => {
          return (
            <div className="okp4-dataverse-portal-share-data-metadata-filling">
              <p>{t('share.metadataFilling.tags')}</p>
              <Field id={id} label={'tags'} onChange={handleChange(id)} value={formItemValue(id)} />
            </div>
          )
        }
      },
      {
        id: 'input-field-10',
        type: 'text',
        label: 'fee',
        value: 0,
        side: 'right',
        renderFormItem: (id): JSX.Element => {
          return (
            <div className="okp4-dataverse-portal-share-data-metadata-filling fee">
              <Field id={id} label={'fee'} onChange={handleChange(id)} value={formItemValue(id)} />
            </div>
          )
        }
      }
    ],
    [formItemValue, handleChange, t]
  )

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
    (error: FormError) => {
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
            {datasetForm.map(
              formItem => formItem.side === side && formItem.renderFormItem(formItem.id)
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
