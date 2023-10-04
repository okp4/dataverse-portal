import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { type FC } from 'react'
import type { Optional } from '@/util/type'
import { StepperProgress } from './stepperProgress/stepperProgress'
import type { Step, UseStepper } from '../../hook/useStepper'
import { useStepper } from '@/ui/hook/useStepper'
import { StepperActions } from './stepperActions/stepperActions'
import './stepper.scss'

export type StepElement = Optional<Omit<Step, 'order'>, 'status'> & {
  content: JSX.Element
  validate?: () => boolean
}

type StepperProps = {
  steps: StepElement[]
  completedMessage?: string
  hideActionsOnComplete?: boolean
}

// eslint-disable-next-line max-lines-per-function
export const Stepper: FC<StepperProps> = ({
  steps: stepElements,
  completedMessage,
  hideActionsOnComplete
}) => {
  const { steps, nextStep, previousStep, activeStepId, previousActiveStepId }: UseStepper =
    useStepper(
      stepElements.map(({ id, status }) => ({
        id,
        status
      }))
    )

  const activeStepElement = stepElements.find(step => step.id === activeStepId) ?? stepElements[0]
  const activeStep = steps.find(step => step.id === activeStepId) ?? steps[0]

  const isEveryStepValid = stepElements.every(stepElement => stepElement.validate?.() ?? true)
  const isLastStep = activeStep.order === steps.length - 1
  const isStepperComplete = isEveryStepValid && isLastStep

  return (
    <div className="okp4-dataverse-portal-stepper-main">
      <StepperProgress
        activeStepId={activeStepId}
        completedMessage={isStepperComplete ? completedMessage : undefined}
        previousActiveStepId={previousActiveStepId}
        steps={steps}
      />

      <TransitionGroup className="okp4-dataverse-portal-stepper-content-wrapper">
        {/* timeout transition duration must match the $transition-duration variable from stepper.scss and progressBar.scss */}
        <CSSTransition classNames="transition" key={activeStepId} timeout={600}>
          <div className="okp4-dataverse-portal-stepper-content">{activeStepElement.content}</div>
        </CSSTransition>
      </TransitionGroup>

      <StepperActions
        hideOnComplete={hideActionsOnComplete && isEveryStepValid && isLastStep}
        isActiveStepValid={activeStepElement.validate?.() ?? true}
        isFirstStep={activeStep.order === 0}
        isLastStep={isLastStep}
        nextStep={nextStep}
        previousStep={previousStep}
      />
    </div>
  )
}
