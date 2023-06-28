import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { type FC } from 'react'
import type { Optional } from '@/util/type'
import { StepperProgress } from './stepperProgress/stepperProgress'
import type { Step, UseStepper } from './useStepper'
import { useStepper } from './useStepper'
import { StepperActions } from './stepperActions/stepperActions'
import './stepper.scss'

export type StepElement = Optional<Omit<Step, 'order'>, 'status'> & {
  content: JSX.Element
}

type StepperProps = {
  steps: StepElement[]
}

// eslint-disable-next-line max-lines-per-function
export const Stepper: FC<StepperProps> = ({ steps: stepElements }) => {
  const { steps, nextStep, previousStep, activeStepId, previousActiveStepId }: UseStepper =
    useStepper(
      stepElements.map(({ id, status }) => ({
        id,
        status
      }))
    )

  const activeStepElement = stepElements.find(step => step.id === activeStepId) ?? stepElements[0]
  const activeStep = steps.find(step => step.id === activeStepId) ?? steps[0]

  return (
    <div className="okp4-dataverse-portal-stepper-main">
      <StepperProgress
        activeStepId={activeStepId}
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
        isFirstStep={activeStep.order === 0}
        isLastStep={activeStep.order === steps.length - 1}
        nextStep={nextStep}
        previousStep={previousStep}
      />
    </div>
  )
}
