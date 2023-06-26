import { createContext, useContext } from 'react'
import type { StepStatus, StepId } from './useStepper'

type StepContextProps = {
  id: StepId
  onUpdateStep: (stepStatus: StepStatus) => void
}

export const StepContext = createContext<StepContextProps | undefined>(undefined)

export const useStepContext = (): StepContextProps => {
  const context = useContext(StepContext)
  if (!context) {
    throw new Error('useStepContext must be used within a StepContextProvider')
  }
  return context
}
