import { TransitionGroup, CSSTransition } from 'react-transition-group'
import type { FC, ReactElement } from 'react'
import { useRef } from 'react'
import { StepperProgress } from './stepperProgress/stepperProgress'
import type { StepId, StepStatus, StepperControls } from './useStepper'
import { useStepper } from './useStepper'
import { StepperActions } from './stepperActions/stepperActions'
import { StepContext } from './stepContext'
import './stepper.scss'

export type StepProps = {
  id: StepId
  onUpdateStep: (stepStatus: StepStatus) => void
}

type Step = ReactElement<StepProps>

type StepperProps = {
  steps: Step[]
}

// eslint-disable-next-line max-lines-per-function
export const Stepper: FC<StepperProps> = ({ steps: stepElements }) => {
  const {
    steps,
    nextStep,
    previousStep,
    updateStep,
    activeStepId,
    previousActiveStepId
  }: StepperControls = useStepper(stepElements.length)

  const stepsWithValidationRef = useRef(
    stepElements.map((stepElement, index) => (
      <StepContext.Provider
        key={steps[index].id}
        value={{
          id: steps[index].id,
          onUpdateStep: (status: StepStatus) => updateStep(steps[index].id, status)
        }}
      >
        {stepElement}
      </StepContext.Provider>
    ))
  )

  const activeStep = stepsWithValidationRef.current.find(
    step => step.props.value.id === activeStepId
  )

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
          <div className="okp4-dataverse-portal-stepper-content">{activeStep}</div>
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
