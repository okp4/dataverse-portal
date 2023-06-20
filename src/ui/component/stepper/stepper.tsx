import type { FC, ReactElement } from 'react'
import { cloneElement, useRef } from 'react'
import { StepperProgress } from './stepperProgress/stepperProgress'
import type { StepId, StepStatus, StepperControls } from './useStepper'
import { useStepper } from './useStepper'
import { StepperActions } from './stepperActions/stepperActions'

export type StepProps = {
  id: StepId
  onUpdateStep: (stepStatus: StepStatus) => void
}

type Step = ReactElement<StepProps>

type StepperProps = {
  steps: Step[]
}

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
    stepElements.map((stepElement, index) =>
      cloneElement(stepElement, {
        id: steps[index].id,
        onUpdateStep: (status: StepStatus) => updateStep(steps[index].id, status)
      })
    )
  )

  const activeStep = stepsWithValidationRef.current.find(step => step.props.id === activeStepId)

  return (
    <div className="okp4-dataverse-portal-stepper-main">
      <StepperProgress
        activeStepId={activeStepId}
        previousActiveStepId={previousActiveStepId}
        steps={steps}
      />
      <div className="okp4-dataverse-portal-stepper-content">{activeStep}</div>
      <StepperActions
        activeStepId={activeStepId}
        nextStep={nextStep}
        previousStep={previousStep}
        steps={steps}
      />
    </div>
  )
}
