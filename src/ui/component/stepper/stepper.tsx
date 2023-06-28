import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { type FC } from 'react'
import type { Optional } from '@/util/type'
import { StepperProgress } from './stepperProgress/stepperProgress'
import type { StepperControls } from './useStepper'
import { useStepper } from './useStepper'
import { StepperActions } from './stepperActions/stepperActions'
import './stepper.scss'

export type StepId = string

export type StepStatus = 'complete' | 'incomplete'

export type Step = {
  id: StepId
  order: number
  status: StepStatus
  content: JSX.Element
}

export type StepElement = Optional<Omit<Step, 'order'>, 'status'>

type StepperProps = {
  steps: StepElement[]
}

// eslint-disable-next-line max-lines-per-function
export const Stepper: FC<StepperProps> = ({ steps: stepElements }) => {
  const { steps, nextStep, previousStep, activeStepId, previousActiveStepId }: StepperControls =
    useStepper(
      stepElements.map(({ id, status }) => ({
        id,
        status
      }))
    )

  const activeStep = stepElements.find(step => step.id === activeStepId) ?? stepElements[0]

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
          <div className="okp4-dataverse-portal-stepper-content">{activeStep.content}</div>
        </CSSTransition>
      </TransitionGroup>

      <StepperActions
        activeStepId={activeStepId}
        nextStep={nextStep}
        previousStep={previousStep}
        steps={steps}
      />
    </div>
  )
}
