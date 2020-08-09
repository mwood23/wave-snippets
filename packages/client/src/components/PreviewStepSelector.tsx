import React, { FC } from 'react'

import { usePreviewDispatch, usePreviewState } from '../context'
import { times } from '../utils'
import { Box, Button } from './core'

type PreviewStepSelectorProps = {
  totalSteps: number
}

export const PreviewStepSelector: FC<PreviewStepSelectorProps> = ({
  totalSteps,
}) => {
  const dispatch = usePreviewDispatch()
  const { currentStep } = usePreviewState()

  return (
    <Box>
      {times(
        (i) => (
          <Button
            isActive={currentStep === i}
            key={i}
            onClick={() => dispatch({ type: 'setStep', step: i })}
          >
            {i + 1}
          </Button>
        ),
        totalSteps,
      )}
    </Box>
  )
}
