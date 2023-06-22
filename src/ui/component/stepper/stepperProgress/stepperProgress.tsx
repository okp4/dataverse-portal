import type { FC } from 'react'
import type { ProgressBarTransition } from './progressBar/progressBar'
import { ProgressBar } from './progressBar/progressBar'
import { findStep, type Step, type StepId } from '../useStepper'
import './stepperProgress.scss'

export type StepStatus = 'error' | 'disabled' | 'complete' | 'incomplete'

type StepperProgressProps = {
  steps: Step[]
  activeStepId: StepId
  previousActiveStepId?: StepId
}

const getProgressBarTransition = ({
  stepOrder,
  activeStepOrder,
  previousActiveStepOrder
}: {
  stepOrder: number
  activeStepOrder: number
  previousActiveStepOrder: number
}): ProgressBarTransition => {
  if (stepOrder === activeStepOrder && previousActiveStepOrder < stepOrder) {
    return 'forward'
  }
  if (stepOrder === previousActiveStepOrder && activeStepOrder < stepOrder) {
    return 'backward'
  }
  return 'none'
}

export const StepperProgress: FC<StepperProgressProps> = ({
  steps,
  activeStepId,
  previousActiveStepId
}) => {
  const activeStep = findStep(steps, activeStepId)
  const previousActiveStep = findStep(steps, previousActiveStepId)

  return (
    <div className="okp4-dataverse-portal-stepper-progress-main">
      {steps.map(({ id, status, order }) => (
        <ProgressBar
          key={id}
          state={id === activeStepId ? 'active' : status === 'complete' ? 'complete' : 'incomplete'}
          transition={getProgressBarTransition({
            stepOrder: order,
            activeStepOrder: activeStep.order,
            previousActiveStepOrder: previousActiveStep.order
          })}
        />
      ))}
      <span className="okp4-dataverse-portal-stepper-progress-step-count">
        {activeStep.order + 1 + '/' + steps.length}
      </span>
    </div>
  )
}
