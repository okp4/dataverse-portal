/* eslint-disable max-lines-per-function */
import { useEffect, useMemo, useCallback, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as O from 'fp-ts/Option'
import * as IOE from 'fp-ts/IOEither'
import * as S from 'fp-ts/string'
import { flow, pipe } from 'fp-ts/lib/function'
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
import './metadataFilling.scss'

type DatasetFormItem = {
  id: string
  type: FormItemType
  label: string
  value: FormItemValue
  render: (id: string) => JSX.Element
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

  const formItemFieldValue = useCallback(
    (id: string): string =>
      flow(
        formItemById(id),
        O.map(({ value }: FormItem) => value),
        O.chain(O.fromPredicate(S.isString)),
        O.getOrElse(() => '')
      )(),
    [formItemById]
  )

  const datasetForm: DatasetForm = useMemo(
    (): DatasetForm => [
      {
        id: 'input-field-1',
        type: 'text',
        label: 'title',
        value: '',
        required: true,
        render: (id): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling">
            <Field
              id={id}
              label={t('share.metadataFilling.datasetTitle')}
              onChange={handleFieldValueChange(id)}
              required
              value={formItemFieldValue(id)}
            />
          </div>
        ),
        style: {
          side: 'left'
        }
      },
      {
        id: 'input-field-2',
        type: 'text',
        label: 'publisher',
        value: '',
        render: (id): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling publisher">
            <Field
              id={id}
              label={t('share.metadataFilling.publisher')}
              onChange={handleFieldValueChange(id)}
              value={formItemFieldValue(id)}
            />
          </div>
        ),
        style: {
          side: 'left',
          inRow: true
        }
      },
      {
        id: 'input-field-3',
        type: 'text',
        label: 'creator',
        value: '',
        render: (id): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling creator">
            <Field
              id={id}
              label={t('share.metadataFilling.creator')}
              onChange={handleFieldValueChange(id)}
              value={formItemFieldValue(id)}
            />
          </div>
        ),
        style: {
          side: 'left',
          inRow: true
        }
      },
      {
        id: 'input-field-4',
        type: 'text',
        label: 'description',
        value: '',
        render: (id): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling description">
            <Field
              id={id}
              label={t('share.metadataFilling.description')}
              multiline
              onChange={handleFieldValueChange(id)}
              value={formItemFieldValue(id)}
            />
          </div>
        ),
        style: {
          side: 'left'
        }
      },
      {
        id: 'input-field-5',
        type: 'text',
        label: 'format',
        value: [],
        render: (id): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling">
            <p>{t('share.metadataFilling.format')}</p>
            <Field
              id={id}
              label={t('share.metadataFilling.formatSelection')}
              onChange={handleFieldValueChange(id)}
              value={formItemFieldValue(id)}
            />
          </div>
        ),
        style: {
          side: 'left'
        }
      },
      {
        id: 'input-field-6',
        type: 'text',
        label: 'license',
        value: [],
        render: (id): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling">
            <p>{t('share.metadataFilling.license')}</p>
            <Field
              id={id}
              label={t('share.metadataFilling.licenceSelection')}
              onChange={handleFieldValueChange(id)}
              value={formItemFieldValue(id)}
            />
          </div>
        ),
        style: {
          side: 'left'
        }
      },
      {
        id: 'input-field-7',
        type: 'text',
        label: 'topic',
        value: [],
        render: (id): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling">
            <p>{t('share.metadataFilling.topic')}</p>
            <Field
              id={id}
              label={t('share.metadataFilling.topicSelection')}
              onChange={handleFieldValueChange(id)}
              value={formItemFieldValue(id)}
            />
          </div>
        ),
        style: {
          side: 'right'
        }
      },
      {
        id: 'input-field-8',
        type: 'text',
        label: 'geographicalCoverage',
        value: [],
        render: (id): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling">
            <p>{t('share.metadataFilling.geographicalCoverage')}</p>
            <Field
              id={id}
              label={t('share.metadataFilling.geographicalCoverageSelection')}
              onChange={handleFieldValueChange(id)}
              value={formItemFieldValue(id)}
            />
          </div>
        ),
        style: {
          side: 'right'
        }
      },
      {
        id: 'input-field-9',
        type: 'text',
        label: 'tags',
        value: [],
        render: (id): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling">
            <p>{t('share.metadataFilling.tags')}</p>
            <Field
              id={id}
              label={'tags'}
              onChange={handleFieldValueChange(id)}
              value={formItemFieldValue(id)}
            />
          </div>
        ),
        style: {
          side: 'right'
        }
      },
      {
        id: 'input-field-10',
        type: 'text',
        label: 'fee',
        value: 0,
        render: (id): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling fee">
            <Field
              id={id}
              label={'fee'}
              onChange={handleFieldValueChange(id)}
              value={formItemFieldValue(id)}
            />
          </div>
        ),
        style: {
          side: 'right'
        }
      }
    ],
    [formItemFieldValue, handleFieldValueChange, t]
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
            {datasetForm.map(
              formItem => formItem.style?.side === side && formItem.render(formItem.id)
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
