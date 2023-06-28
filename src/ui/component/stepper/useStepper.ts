import { useCallback, useState } from 'react'
import type { Step, StepElement, StepId, StepStatus } from './stepper'

export type UseStepperInput = Array<Omit<StepElement, 'content'>>

export type StepperControls = {
  steps: Omit<Step, 'content'>[]
  nextStep: () => void
  previousStep: () => void
  activeStepId: StepId
  previousActiveStepId?: StepId
}

type ActiveStepsId = {
  current: StepId
  previous?: StepId
}

export const findStep = (steps: Omit<Step, 'content'>[], stepId?: StepId): Omit<Step, 'content'> =>
  steps.find(({ id }) => id === stepId) ?? steps[0]

// eslint-disable-next-line max-lines-per-function
export const useStepper = (stepsProps: UseStepperInput): StepperControls => {
  const [activeStepsId, setActiveStepsId] = useState<ActiveStepsId>({
    current: stepsProps[0].id
  })

  const [steps, setSteps] = useState<Omit<Step, 'content'>[]>(
    stepsProps.map((step, index) => ({
      ...step,
      order: index,
      status: step.status ?? 'incomplete'
    }))
  )

  const updateStepStatus = useCallback((stepId: string, stepStatus: StepStatus) => {
    setSteps(prevSteps => {
      const matchPreviousStep = prevSteps.find(step => step.id === stepId)?.status === stepStatus

      if (matchPreviousStep) return prevSteps

      return prevSteps.map(step =>
        step.id === stepId
          ? {
              ...step,
              status: stepStatus
            }
          : step
      )
    })
  }, [])

  const nextStep = useCallback(() => {
    const activeStep = findStep(steps, activeStepsId.current)
    // TODO: add validation check: if active step is not valid, return
    if (activeStep.order === steps.length - 1) return

    const nextStep = steps.find(step => step.order === activeStep.order + 1)
    const nextStepId = nextStep?.id
    if (!nextStepId) return

    updateStepStatus(activeStep.id, 'complete')
    updateStepStatus(nextStepId, 'incomplete')

    setActiveStepsId(prevActiveStepsId => ({
      current: nextStepId,
      previous: prevActiveStepsId.current
    }))
  }, [activeStepsId, steps, updateStepStatus])

  const previousStep = useCallback(() => {
    const activeStep = findStep(steps, activeStepsId.current)
    if (activeStep.order === 0) return

    const previousStep = steps.find(step => step.order === activeStep.order - 1)
    const previousStepId = previousStep?.id
    if (!previousStepId) return

    // TODO: add validation check: if active step is valid, update with 'complete' status
    updateStepStatus(activeStep.id, 'incomplete')

    updateStepStatus(previousStepId, 'incomplete')

    setActiveStepsId(prevActiveStepsId => ({
      current: previousStepId,
      previous: prevActiveStepsId.current
    }))
  }, [activeStepsId, steps, updateStepStatus])

  return {
    steps,
    nextStep,
    previousStep,
    activeStepId: activeStepsId.current,
    previousActiveStepId: activeStepsId.previous
  }
}
