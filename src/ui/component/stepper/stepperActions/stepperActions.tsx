/* eslint-disable max-lines-per-function */
import { useCallback, type FC } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Button } from '@/ui/component/button/button'
import { Icon } from '@/ui/component/icon/icon'
import './stepperActions.scss'

type StepperActionsProps = {
  isFirstStep: boolean
  isLastStep: boolean
  nextStep: () => void
  previousStep: (isActiveStepValid: boolean) => void
  isActiveStepValid: boolean
}

export const StepperActions: FC<StepperActionsProps> = ({
  nextStep,
  previousStep,
  isFirstStep,
  isLastStep,
  isActiveStepValid
}) => {
  const { t } = useTranslation('common')

  const handleNextButtonClick = useCallback(() => {
    if (!isActiveStepValid) return
    nextStep()
  }, [isActiveStepValid, nextStep])

  const handlePreviousButtonClick = useCallback(() => {
    previousStep(isActiveStepValid)
  }, [isActiveStepValid, previousStep])

  return (
    <div className="okp4-dataverse-portal-stepper-actions-main">
      <Button
        className={classNames('okp4-dataverse-portal-stepper-actions-button', 'previous', {
          hidden: isFirstStep
        })}
        icons={{
          startIcon: <Icon name="forward" />
        }}
        label={t('actions.previous')}
        onClick={handlePreviousButtonClick}
        variant="tertiary"
      />
      <Button
        className={classNames(
          'okp4-dataverse-portal-stepper-actions-button',
          { hidden: isLastStep },
          {
            disabled: !isActiveStepValid
          }
        )}
        disabled={!isActiveStepValid}
        icons={{
          endIcon: <Icon name="forward" />
        }}
        label={t('actions.next')}
        onClick={handleNextButtonClick}
        size="small"
        variant="tertiary"
      />
    </div>
  )
}
