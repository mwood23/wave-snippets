import React, { FC } from 'react'

import { times } from '../utils'
import { Box, Button } from './core'

type StepSelectorProps = {
  currentStep: number
  totalSteps: number
}

export const StepSelector: FC<StepSelectorProps> = ({
  currentStep,
  totalSteps,
}) => {
  console.log(currentStep)

  return (
    <Box>
      {times((i) => {
        const step = i + 1
        return (
          <Button isActive={currentStep === step} key={i}>
            {step}
          </Button>
        )
      }, totalSteps)}
    </Box>
  )
}
