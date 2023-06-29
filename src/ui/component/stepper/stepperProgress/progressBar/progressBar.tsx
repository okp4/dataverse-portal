import classNames from 'classnames'
import type { FC } from 'react'
import type { StepStatus } from '../../useStepper'
import './progressBar.scss'

type ProgressBarState = 'active' | StepStatus
export type ProgressBarTransition = 'none' | 'backward' | 'forward'

type ProgressBarProps = {
  state: ProgressBarState
  transition: ProgressBarTransition
}

export const ProgressBar: FC<ProgressBarProps> = ({ state, transition }) => (
  <div
    className={classNames('okp4-dataverse-portal-progress-bar-main', state, transition, {
      'delayed-transition': transition === 'forward'
    })}
  />
)
