/* eslint-disable max-lines-per-function */
import { type FC } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Button } from '@/ui/component/button/button'
import { Icon } from '@/ui/component/icon/icon'
import './stepperActions.scss'

type StepperActionsProps = {
  isFirstStep: boolean
  isLastStep: boolean
  nextStep: () => void
  previousStep: () => void
}

export const StepperActions: FC<StepperActionsProps> = ({
  nextStep,
  previousStep,
  isFirstStep,
  isLastStep
}) => {
  const { t } = useTranslation('common')

  return (
    <div className="okp4-dataverse-portal-stepper-actions-main">
      <Button
        className={classNames('okp4-dataverse-portal-stepper-actions-button', 'previous', {
          hidden: isFirstStep
        })}
        icons={{
          startIcon: <Icon name="forward" />
        }}
        label={t('actions.previous')}
        onClick={previousStep}
        variant="tertiary"
      />
      <Button
        className={classNames(
          'okp4-dataverse-portal-stepper-actions-button',
          { hidden: isLastStep },
          {
            disabled: false // TODO: add validation
          }
        )}
        disabled={false} // TODO: add validation
        icons={{
          endIcon: <Icon name="forward" />
        }}
        label={t('actions.next')}
        onClick={nextStep}
        size="small"
        variant="tertiary"
      />
    </div>
  )
}
