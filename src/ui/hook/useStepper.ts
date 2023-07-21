import { useCallback, useState } from 'react'
import type { Optional } from '@/util/type'

export type StepId = string

export type StepStatus = 'complete' | 'incomplete'

export type UseStepperInput = Optional<Omit<Step, 'order'>, 'status'>[]

export type UseStepper = {
  steps: Step[]
  nextStep: () => void
  previousStep: (isActiveStepValid: boolean) => void
  activeStepId: StepId
  previousActiveStepId?: StepId
}

type ActiveStepsId = {
  current: StepId
  previous?: StepId
}

export type Step = {
  id: StepId
  order: number
  status: StepStatus
  validate?: () => boolean
}

export const findStep = (steps: Step[], stepId?: StepId): Step =>
  steps.find(({ id }) => id === stepId) ?? steps[0]

// eslint-disable-next-line max-lines-per-function
export const useStepper = (stepsProps: UseStepperInput): UseStepper => {
  const [activeStepsId, setActiveStepsId] = useState<ActiveStepsId>({
    current: stepsProps[0].id
  })

  const [steps, setSteps] = useState<Step[]>(
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

  const previousStep = useCallback(
    (isActiveStepValid: boolean) => {
      const activeStep = findStep(steps, activeStepsId.current)
      if (activeStep.order === 0) return

      const previousStep = steps.find(step => step.order === activeStep.order - 1)
      const previousStepId = previousStep?.id
      if (!previousStepId) return

      updateStepStatus(activeStep.id, isActiveStepValid ? 'complete' : 'incomplete')
      updateStepStatus(previousStepId, 'incomplete')

      setActiveStepsId(prevActiveStepsId => ({
        current: previousStepId,
        previous: prevActiveStepsId.current
      }))
    },
    [activeStepsId, steps, updateStepStatus]
  )

  return {
    steps,
    nextStep,
    previousStep,
    activeStepId: activeStepsId.current,
    previousActiveStepId: activeStepsId.previous
  }
}
