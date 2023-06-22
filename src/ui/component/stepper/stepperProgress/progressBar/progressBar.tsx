import classNames from 'classnames'
import type { FC } from 'react'
import type { StepStatus } from '../stepperProgress'
import './progressBar.scss'

type ProgressBarState = 'active' | Extract<StepStatus, 'complete' | 'incomplete'>
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
