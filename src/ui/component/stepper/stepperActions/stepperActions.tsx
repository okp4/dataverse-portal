import type { FC } from 'react'
import classNames from 'classnames'
import { Button } from '@/ui/component/button/button'
import { Icon } from '@/ui/component/icon/icon'
import { findStep, type Step, type StepId } from '../useStepper'
import './stepperActions.scss'
import { useTranslation } from 'react-i18next'

type StepperActionsProps = {
  activeStepId: StepId
  steps: Step[]
  nextStep: () => void
  previousStep: () => void
}

export const StepperActions: FC<StepperActionsProps> = ({
  activeStepId,
  steps,
  nextStep,
  previousStep
}) => {
  const { t } = useTranslation('common')

  const activeStep = findStep(steps, activeStepId)
  const isStepComplete = activeStep.status === 'complete'
  const isFirstStep = activeStep.order === 0
  const isLastStep = activeStep.order === steps.length - 1

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
        onClick={previousStep}
        variant="tertiary"
      />
      <Button
        className={classNames(
          'okp4-dataverse-portal-stepper-actions-button',
          { hidden: isLastStep },
          {
            disabled: !isStepComplete
          }
        )}
        disabled={!isStepComplete}
        icons={{
          endIcon: <Icon name="forward" />
        }}
        label={t('actions.next')}
        onClick={nextStep}
        size="small"
        variant="tertiary"
      />
    </div>
  )
}
