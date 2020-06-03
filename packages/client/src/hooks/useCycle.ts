import { Dispatch, SetStateAction, useState } from 'react'

import { DEFAULT_CYCLE_SPEED } from '../const'
import { useInterval } from './useInterval'

type UseCycleProps = {
  totalSteps: number
  initialStep?: number
  /**
   * Time in milliseconds for the springs to be activated between steps. A lower number is a quicker animation.
   */
  cycleSpeed?: number

  pause?: boolean
}

export const useCycle = ({
  totalSteps,
  initialStep = 0,
  cycleSpeed = DEFAULT_CYCLE_SPEED,
  pause = false,
}: UseCycleProps): [number, Dispatch<SetStateAction<number>>] => {
  const [currentStep, setCurrentStep] = useState(initialStep)

  useInterval(
    () => {
      return setCurrentStep(currentStep === totalSteps ? 0 : currentStep + 1)
    },
    { delay: cycleSpeed, pause },
  )

  return [currentStep, setCurrentStep]
}
