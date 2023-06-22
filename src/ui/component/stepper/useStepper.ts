import { useCallback, useMemo, useReducer, useState } from 'react'
import uuid from 'short-uuid'

export type StepId = string
export type StepStatus = 'complete' | 'incomplete' | 'error' | 'disabled'

export type Step = {
  id: StepId
  order: number
  status: StepStatus
}

export type StepperControls = {
  steps: Step[]
  nextStep: () => void
  previousStep: () => void
  updateStep: (stepId: string, status: StepStatus) => void
  activeStepId: StepId
  previousActiveStepId?: StepId
}

export const findStep = (steps: Step[], stepId?: StepId): Step =>
  steps.find(({ id }) => id === stepId) ?? steps[0]

type activeStepsId = {
  current: StepId
  previous?: StepId
}

const activeStepsIdReducer = (state: activeStepsId, action: StepId): activeStepsId => ({
  current: action,
  previous: state.current
})

// eslint-disable-next-line max-lines-per-function
export const useStepper = (totalSteps: number): StepperControls => {
  const firstStepId = useMemo(() => uuid.generate(), [])

  const [activeStepsId, setActiveStepsId] = useReducer(activeStepsIdReducer, {
    current: firstStepId
  })

  const [steps, setSteps] = useState<Step[]>(
    Array.from({ length: totalSteps }, (_, index) => ({
      id: index === 0 ? firstStepId : uuid.generate(),
      status: 'incomplete',
      order: index
    }))
  )

  const nextStep = useCallback(() => {
    const activeStep = findStep(steps, activeStepsId.current)
    if (activeStep.status !== 'complete' || activeStep.order === steps.length - 1) return

    const nextStepId = steps.find(step => step.order === activeStep.order + 1)?.id
    if (!nextStepId) return

    setActiveStepsId(nextStepId)
  }, [activeStepsId, steps])

  const previousStep = useCallback(() => {
    const activeStep = findStep(steps, activeStepsId.current)
    if (activeStep.order === 0) return

    const previousStepId = steps.find(step => step.order === activeStep.order - 1)?.id
    if (!previousStepId) return

    setActiveStepsId(previousStepId)
  }, [activeStepsId, steps])

  const updateStep = useCallback((stepId: string, stepStatus: StepStatus) => {
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

  return {
    steps,
    nextStep,
    previousStep,
    updateStep,
    activeStepId: activeStepsId.current,
    previousActiveStepId: activeStepsId.previous
  }
}
