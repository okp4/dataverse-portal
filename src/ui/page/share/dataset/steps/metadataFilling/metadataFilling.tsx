/* eslint-disable max-lines-per-function */
import type { ChangeEvent } from 'react'
import { useEffect, useMemo, useCallback, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as IOO from 'fp-ts/IOOption'
import * as IOE from 'fp-ts/IOEither'
import * as S from 'fp-ts/string'
import * as O from 'fp-ts/Option'
import * as N from 'fp-ts/number'
import * as I from 'fp-ts/Identity'
import { apply, constant, flow, pipe } from 'fp-ts/lib/function'
import type { FormError, InitFormPayload } from '@/ui/store/slice/shareData/shareData.slice'
import { useAppStore } from '@/ui/store'
import type { ResourceError } from '@/shared/error/resource'
import { ShowResourceError } from '@/shared/error/resource'
import { ShowPayloadError, type PayloadError } from '@/shared/error/payload'
import { TextField } from '@/ui/component/field/textField'
import type { NotificationType } from '@/ui/component/notification/notification'
import { useDispatchNotification } from '@/ui/hook/useDispatchNotification'
import { TagsField } from '@/ui/view/tagsField/tagsField'
import './metadataFilling.scss'
import { NumericField } from '@/ui/component/field/numericField'
import { DropDown } from '@/ui/view/share/data/dropDown/dropDown'

type FormItemBaseProps = {
  id: string
  title: string
  render: () => JSX.Element
  required?: boolean
  style?: {
    side?: 'left' | 'right'
    inRow?: boolean
  }
}

type I18nString = {
  language: string
  value: string
}

type I18nTextFieldValue = I18nString[]

type I18NTextField = FormItemBaseProps & {
  type: 'i18n-text'
  value: O.Option<I18nTextFieldValue>
}

export type TextField = FormItemBaseProps & {
  type: 'text'
  value: O.Option<string>
}

type NumericField = FormItemBaseProps & {
  type: 'numeric'
  value: O.Option<number>
}

type TagField = FormItemBaseProps & {
  type: 'tag'
  value: O.Option<string[]>
}

type SelectPicker = FormItemBaseProps & {
  type: 'select'
  value: O.Option<string[]>
}

type DatasetFormItem = TextField | NumericField | TagField | SelectPicker | I18NTextField

type DatasetForm = DatasetFormItem[]

type NotificationData = {
  title: string
  type: NotificationType
}

const formErrorData = (
  error: ResourceError | PayloadError | FormError
): NotificationData | void => {
  switch (error._tag) {
    case 'resource-not-found':
    case 'resource-already-exists':
    case 'payload-is-empty':
    case 'form-item-wrong-type':
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

  const handleTagsFieldValueChange = useCallback(
    (id: string) => (tag: string) => {
      setFormItemValue(id, tag)()
    },
    [setFormItemValue]
  )

  const handleFieldValueChange = useCallback(
    (id: string) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormItemValue(id, event.target.value)()
    },
    [setFormItemValue]
  )

  const handleNumericValueChange = useCallback(
    (id: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      !isNaN(Number(value)) && setFormItemValue(id, Number(value))()
    },
    [setFormItemValue]
  )

  const numericalFieldValue = (v: DatasetFormItem['value']) => (): string =>
    pipe(
      v,
      O.chain(O.fromPredicate(N.isNumber)),
      O.map(N.Show.show),
      O.getOrElse(constant(S.empty))
    )

  const singleValueField = useCallback(
    (id: string): string =>
      pipe(
        id,
        formItemById,
        IOO.map(({ value }) => value),
        IOO.match(constant(S.empty), v =>
          pipe(v, O.chain(O.fromPredicate(S.isString)), O.getOrElse(numericalFieldValue(v)))
        ),
        apply(null)
      ),
    [formItemById]
  )

  // TODO: fetch default options from ontology
  const defaultFormatOption = useMemo(
    () => [
      'option1',
      'option2',
      'option3',
      'option4',
      'option5',
      'option6',
      'option7',
      'option8',
      'option9',
      'option10',
      'option11',
      'option12'
    ],
    []
  )

  const multiValuesField = useCallback(
    (id: string): string[] =>
      pipe(
        id,
        formItemById,
        IOO.map(({ value }) => value),
        IOO.match(
          () => [],
          flow(
            O.flatMap(O.fromPredicate(Array.isArray)),
            O.match(() => defaultFormatOption, I.of)
          )
        ),
        apply(null)
      ),
    [formItemById, defaultFormatOption]
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
        title: 'title',
        value: O.none,
        required: true,
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling" key={id1}>
            <TextField
              id={id1}
              label={t('share.metadataFilling.datasetTitle')}
              onChange={handleFieldValueChange(id1)}
              required
              value={singleValueField(id1)}
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
        title: 'publisher',
        value: O.none,
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling publisher" key={id2}>
            <TextField
              id={id2}
              label={t('share.metadataFilling.publisher')}
              onChange={handleFieldValueChange(id2)}
              value={singleValueField(id2)}
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
        title: 'creator',
        value: O.none,
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling creator" key={id3}>
            <TextField
              id={id3}
              label={t('share.metadataFilling.creator')}
              onChange={handleFieldValueChange(id3)}
              value={singleValueField(id3)}
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
        title: 'description',
        value: O.none,
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling description" key={id4}>
            <TextField
              id={id4}
              label={t('share.metadataFilling.description')}
              multiline
              onChange={handleFieldValueChange(id4)}
              value={singleValueField(id4)}
            />
          </div>
        ),
        style: {
          side: 'left'
        }
      },
      {
        id: id5,
        type: 'select',
        title: 'format',
        value: O.none,
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling" key={id5}>
            <p className="okp4-dataverse-portal-share-data-metadata-filling-legend">
              {t('share.metadataFilling.format')}
            </p>
            <DropDown
              onChange={handleFieldValueChange(id5)}
              options={defaultFormatOption}
              placeholder={t('share.metadataFilling.formatSelection')}
              searchPlaceholder={t('share.metadataFilling.formatSelection')}
              selectionType="checkbox"
              value={multiValuesField(id5)}
            />
          </div>
        ),
        style: {
          side: 'left'
        }
      },
      {
        id: id6,
        type: 'select',
        title: 'license',
        value: O.none,
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling" key={id6}>
            <p className="okp4-dataverse-portal-share-data-metadata-filling-legend">
              {t('share.metadataFilling.license')}
            </p>
            <DropDown
              onChange={handleFieldValueChange(id6)}
              options={defaultFormatOption}
              placeholder={t('share.metadataFilling.licenceSelection')}
              searchPlaceholder={t('share.metadataFilling.licenceSelection')}
              selectionType="checkbox"
              value={multiValuesField(id6)}
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
        title: 'topic',
        value: O.none,
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling" key={id7}>
            <p className="okp4-dataverse-portal-share-data-metadata-filling-legend">
              {t('share.metadataFilling.topic')}
            </p>
            <TextField
              id={id7}
              label={t('share.metadataFilling.topicSelection')}
              onChange={handleFieldValueChange(id7)}
              value={singleValueField(id7)}
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
        title: 'geographicalCoverage',
        value: O.none,
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling" key={id8}>
            <p className="okp4-dataverse-portal-share-data-metadata-filling-legend">
              {t('share.metadataFilling.geographicalCoverage')}
            </p>
            <TextField
              id={id8}
              label={t('share.metadataFilling.geographicalCoverageSelection')}
              onChange={handleFieldValueChange(id8)}
              value={singleValueField(id8)}
            />
          </div>
        ),
        style: {
          side: 'right'
        }
      },
      {
        id: id9,
        type: 'tag',
        title: 'tags',
        value: O.none,
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling" key={id9}>
            <p className="okp4-dataverse-portal-share-data-metadata-filling-legend">
              {t('share.metadataFilling.tags')}
            </p>
            <TagsField
              addTag={handleTagsFieldValueChange(id9)}
              removeTag={handleTagsFieldValueChange(id9)}
              tags={multiValuesField(id9)}
            />
          </div>
        ),
        style: {
          side: 'right'
        }
      },
      {
        id: id10,
        type: 'numeric',
        title: 'fee',
        value: O.none,
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling fee" key={id10}>
            <NumericField
              decimalPseudoSeparators={[',']}
              decimalSeparator="."
              id={id10}
              max={Infinity}
              min={0}
              onChange={handleNumericValueChange(id10)}
              placeholder="0"
              precision={APP_ENV.chains[0].feeCurrencies[0].coinDecimals}
              rightElement={<span>{APP_ENV.chains[0].currencies[0].coinDenom}</span>}
              thousandSeparator=" " // narrow no-break space U+202F
              value={singleValueField(id10)}
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
    singleValueField,
    multiValuesField,
    handleNumericValueChange,
    handleTagsFieldValueChange,
    defaultFormatOption
  ])

  const mapForm = (form: DatasetForm): InitFormPayload =>
    form.map(formItem => {
      switch (formItem.type) {
        case 'i18n-text':
          return {
            ...formItem,
            type: 'i18n-text'
          }
        case 'text':
          return {
            ...formItem,
            type: 'text'
          }
        case 'numeric':
          return {
            ...formItem,
            type: 'numeric'
          }
        case 'select':
          return {
            ...formItem,
            type: 'select'
          }
        case 'tag':
          return {
            ...formItem,
            type: 'tag'
          }
      }
    })

  const handleFormError = useCallback(
    (error: ResourceError | PayloadError) => {
      console.error(
        error._tag === 'payload-is-empty'
          ? ShowPayloadError.show(error)
          : ShowResourceError.show(error)
      )
      const notification = formErrorData(error)
      notification &&
        dispatchNotification({
          type: notification.type,
          titleKey: notification.title
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
