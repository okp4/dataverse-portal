import type { FC } from 'react'
import type { Step, StepId } from '@/ui/hook/useStepper'
import { findStep } from '@/ui/hook/useStepper'
import type { ProgressBarTransition } from './progressBar/progressBar'
import { ProgressBar } from './progressBar/progressBar'
import './stepperProgress.scss'

type StepperProgressProps = {
  steps: Step[]
  activeStepId: StepId
  previousActiveStepId?: StepId
  completedMessage?: string
}

const getProgressBarTransition = ({
  stepOrder,
  activeStepOrder,
  previousActiveStepOrder,
  completedMessage
}: {
  stepOrder: number
  activeStepOrder: number
  previousActiveStepOrder: number
  completedMessage?: string
}): ProgressBarTransition => {
  if (completedMessage) {
    return 'none'
  }
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
  previousActiveStepId,
  completedMessage
}) => {
  const activeStep = findStep(steps, activeStepId)
  const previousActiveStep = findStep(steps, previousActiveStepId)

  return (
    <div className="okp4-dataverse-portal-stepper-progress-main">
      {steps.map(({ id, status, order }) => (
        <ProgressBar
          key={id}
          state={completedMessage ? 'complete' : id === activeStepId ? 'active' : status}
          transition={getProgressBarTransition({
            stepOrder: order,
            activeStepOrder: activeStep.order,
            previousActiveStepOrder: previousActiveStep.order,
            completedMessage
          })}
        />
      ))}
      <span className="okp4-dataverse-portal-stepper-progress-step-count">
        {completedMessage ?? activeStep.order + 1 + '/' + steps.length}
      </span>
    </div>
  )
}
