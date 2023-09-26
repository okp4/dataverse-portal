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
import {
  type FormError,
  type InitFormPayload,
  type DateStringRange,
  isDateStringRange
} from '@/ui/store/slice/shareData/shareData.slice'
import { useAppStore } from '@/ui/store'
import type { ResourceError } from '@/shared/error/resource'
import { ShowResourceError } from '@/shared/error/resource'
import { ShowPayloadError, type PayloadError } from '@/shared/error/payload'
import { TextField } from '@/ui/component/field/textField'
import type { NotificationType } from '@/ui/component/notification/notification'
import { useDispatchNotification } from '@/ui/hook/useDispatchNotification'
import { TagsField } from '@/ui/view/tagsField/tagsField'
import { NumericField } from '@/ui/component/field/numericField'
import { KnowFee } from '@/ui/view/share/knowFee/knowFee'
import { MultiselectDropDown } from '@/ui/component/dropDown/multiselectDropDown'
import type { DateRange } from '@/ui/component/dateRangePicker/dateRangePicker'
import { DateRangePicker } from '@/ui/component/dateRangePicker/dateRangePicker'
import './metadataFilling.scss'

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

type DateStringRangeField = FormItemBaseProps & {
  type: 'date-range'
  value: O.Option<DateStringRange>
}

type DatasetFormItem =
  | TextField
  | NumericField
  | TagField
  | SelectPicker
  | I18NTextField
  | DateStringRangeField

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
            O.match(() => [], I.of)
          )
        ),
        apply(null)
      ),
    [formItemById]
  )

  const handleTagsFieldValueChange = useCallback(
    (id: string) => (tag: string) => {
      const isTagPresent = multiValuesField(id).includes(tag)
      !isTagPresent && setFormItemValue(id, tag)()
    },
    [multiValuesField, setFormItemValue]
  )

  const removeTag = useCallback(
    (id: string) => (tag: string) => {
      setFormItemValue(id, tag)()
    },
    [setFormItemValue]
  )

  const handleDateRangeValueChange = useCallback(
    (id: string) => (dateRange: DateRange) => {
      const dateStringRange: DateStringRange = {
        from: dateRange.from ? dateRange.from.toISOString() : null,
        to: dateRange.to ? dateRange.to.toISOString() : null
      }
      setFormItemValue(id, dateStringRange)()
    },
    [setFormItemValue]
  )

  const dateRangeValueField = useCallback(
    (id: string): DateRange =>
      pipe(
        id,
        formItemById,
        IOO.map(({ value }) => value),
        IOO.match(
          constant({}),
          flow(
            O.match(
              constant({}),
              flow(
                O.fromPredicate(isDateStringRange),
                O.fold(constant({}), ({ from, to }) => ({
                  from: from ? new Date(from) : undefined,
                  to: to ? new Date(to) : undefined
                }))
              )
            )
          )
        ),
        apply(null)
      ),
    [formItemById]
  )

  const handleFieldValueChange = useCallback(
    (id: string) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormItemValue(id, event.target.value)()
    },
    [setFormItemValue]
  )

  const handleNumericValueChange = useCallback(
    (id: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      const isValueValid = value !== '' || !isNaN(Number(value))
      // TODO: allow to set back to empty value in the slice
      // User should be able to set back to empty value
      setFormItemValue(id, isValueValid ? Number(value) : NaN)()
    },
    [setFormItemValue]
  )

  const numericValueField = useCallback(
    (id: string): number =>
      pipe(
        id,
        formItemById,
        IOO.map(({ value }) => value),
        IOO.match(constant(NaN), v =>
          pipe(v, O.chain(O.fromPredicate(N.isNumber)), O.getOrElse(constant(NaN)))
        ),
        apply(null)
      ),
    [formItemById]
  )

  const textValueField = useCallback(
    (id: string): string =>
      pipe(
        id,
        formItemById,
        IOO.map(({ value }) => value),
        IOO.match(constant(S.empty), v =>
          pipe(v, O.chain(O.fromPredicate(S.isString)), O.getOrElse(constant(S.empty)))
        ),
        apply(null)
      ),
    [formItemById]
  )

  // TODO: fetch default options from ontology
  // and use them as default values in the slice
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
    const id11 = 'input-field-11'

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
              value={textValueField(id1)}
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
              value={textValueField(id2)}
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
              value={textValueField(id3)}
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
              value={textValueField(id4)}
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
              {t('share.metadataFilling.formatLabel')}
            </p>
            <MultiselectDropDown
              label={t('share.metadataFilling.format')}
              onChange={handleTagsFieldValueChange(id5)}
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
              {t('share.metadataFilling.licenseLabel')}
            </p>
            <MultiselectDropDown
              label={t('share.metadataFilling.license')}
              onChange={handleTagsFieldValueChange(id6)}
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
        type: 'select',
        title: 'topic',
        value: O.none,
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling" key={id7}>
            <p className="okp4-dataverse-portal-share-data-metadata-filling-legend">
              {t('share.metadataFilling.topicLabel')}
            </p>
            <MultiselectDropDown
              label={t('share.metadataFilling.topic')}
              onChange={handleTagsFieldValueChange(id7)}
              options={defaultFormatOption}
              placeholder={t('share.metadataFilling.topicSelection')}
              searchPlaceholder={t('share.metadataFilling.topicSelection')}
              selectionType="checkbox"
              value={multiValuesField(id7)}
            />
          </div>
        ),
        style: {
          side: 'right'
        }
      },
      {
        id: id8,
        type: 'select',
        title: 'geographicalCoverage',
        value: O.none,
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling" key={id8}>
            <p className="okp4-dataverse-portal-share-data-metadata-filling-legend">
              {t('share.metadataFilling.geographicalCoverageLabel')}
            </p>
            <MultiselectDropDown
              label={t('share.metadataFilling.geographicalCoverage')}
              onChange={handleTagsFieldValueChange(id8)}
              options={defaultFormatOption}
              placeholder={t('share.metadataFilling.geographicalCoverageSelection')}
              searchPlaceholder={t('share.metadataFilling.geographicalCoverageSelection')}
              selectionType="checkbox"
              value={multiValuesField(id8)}
            />
          </div>
        ),
        style: {
          side: 'right'
        }
      },
      {
        id: id9,
        type: 'date-range',
        title: 'temporalCoverage',
        value: O.none,
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling" key={id9}>
            <div className="okp4-dataverse-portal-share-data-metadata-filling-temporal-coverage">
              <p className="okp4-dataverse-portal-share-data-metadata-filling-legend">
                {t('share.metadataFilling.temporalCoverageLabel')}
              </p>
              <DateRangePicker
                fromDate={dateRangeValueField(id9).from}
                fromYear={new Date().getFullYear() + APP_ENV.datePicker.fromYearOffset}
                onSelect={handleDateRangeValueChange(id9)}
                selected={dateRangeValueField(id9)}
                toDate={dateRangeValueField(id9).to}
                toYear={new Date().getFullYear() + APP_ENV.datePicker.toYearOffset}
              />
            </div>
          </div>
        ),
        style: {
          side: 'right'
        }
      },
      {
        id: id10,
        type: 'tag',
        title: 'tags',
        value: O.none,
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling" key={id10}>
            <p className="okp4-dataverse-portal-share-data-metadata-filling-legend">
              {t('share.metadataFilling.tags')}
            </p>
            <TagsField
              addTag={handleTagsFieldValueChange(id10)}
              removeTag={removeTag(id10)}
              tags={multiValuesField(id10)}
            />
          </div>
        ),
        style: {
          side: 'right'
        }
      },
      {
        id: id11,
        type: 'numeric',
        title: 'fee',
        value: O.none,
        render: (): JSX.Element => (
          <div className="okp4-dataverse-portal-share-data-metadata-filling fee" key={id11}>
            <KnowFee
              field={
                <NumericField
                  decimalPseudoSeparators={[',']}
                  decimalSeparator="."
                  id={id11}
                  max={Infinity}
                  min={0}
                  onChange={handleNumericValueChange(id11)}
                  placeholder="0"
                  precision={APP_ENV.chains[0].feeCurrencies[0].coinDecimals}
                  rightElement={<span>{APP_ENV.chains[0].currencies[0].coinDenom}</span>}
                  thousandSeparator=" " // narrow no-break space U+202F
                  value={numericValueField(id11)}
                />
              }
              label={t('share.metadataFilling.enterDatasetFee')}
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
    textValueField,
    numericValueField,
    multiValuesField,
    handleNumericValueChange,
    handleTagsFieldValueChange,
    defaultFormatOption,
    removeTag,
    handleDateRangeValueChange,
    dateRangeValueField
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
        case 'date-range':
          return {
            ...formItem,
            type: 'date-range'
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
