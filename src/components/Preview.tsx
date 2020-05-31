import { CodeSurfer } from '@code-surfer/standalone'
import React, { forwardRef, useEffect, useState } from 'react'
import {
  config as ReactSpringPresets,
  SpringConfig,
  animated,
  useSpring,
} from 'react-spring'
import { ThemeProvider } from 'theme-ui'
import { useDebouncedCallback } from 'use-debounce'

import { CODE_THEMES_DICT } from '../code-themes'
import { DEFAULT_PREVIEW_THEME } from '../const'
import { InputStep, usePreviewDispatch, usePreviewState } from '../context'
import { noop } from '../utils'
import { Box, Spinner } from './core'

const AnimatedCodeSurfer = animated(CodeSurfer)

export type PreviewProps = {
  steps: InputStep[]

  springConfig?: SpringConfig

  // TODO: Create more fun presets
  springPreset?: keyof typeof ReactSpringPresets

  theme?: string

  playOnInit?: boolean

  cycle?: boolean
  cycleSpeed?: number
  immediate?: boolean

  onAnimationCycleEnd: () => void
}

// TODO: Hook up all the props
export const Preview = forwardRef<any, PreviewProps>(
  (
    {
      steps,
      springPreset = 'molasses',
      theme = DEFAULT_PREVIEW_THEME,
      cycleSpeed,
      immediate,
      cycle,
      onAnimationCycleEnd = noop,
    },
    ref,
  ) => {
    const totalSteps = steps.length - 1
    const dispatch = usePreviewDispatch()
    const { currentStep, isPlaying } = usePreviewState()
    const [codeSurferKey, setCodeSurferKey] = useState(1)
    const [loading, setLoading] = useState(false)

    console.log(steps)

    const [debouncedCallback] = useDebouncedCallback(() => {
      setLoading(false)
      setCodeSurferKey((key) => {
        return key + 1
      })
    }, 1500)

    useEffect(() => {
      setLoading(true)
      debouncedCallback()
    }, [steps])

    useEffect(() => {
      if (isPlaying) {
        dispatch({
          type: 'updatePreviewState',
          currentStep: totalSteps > 1 ? currentStep + 1 : currentStep,
        })
      }
    }, [isPlaying])

    const props = useSpring({
      progress: currentStep,
      config: ReactSpringPresets[springPreset],
      delay: cycleSpeed,
      onRest: () => {
        if (isPlaying) {
          dispatch({
            type: 'updatePreviewState',
            currentStep:
              // How many more can we go?!
              totalSteps > 1
                ? currentStep === totalSteps
                  ? cycle
                    ? 0
                    : currentStep
                  : currentStep + 1
                : currentStep,
          })
        }

        if (currentStep === totalSteps) {
          onAnimationCycleEnd()
        }
      },
      // pause: !isPlaying,
      immediate,
    })

    return (
      <Box
        height={'314px'}
        overflow={'hidden'}
        position="relative"
        ref={ref}
        width={'550px'}
      >
        {codeSurferKey !== 1 && loading && (
          <Spinner position="absolute" right="6" top="0" zIndex={5000} />
        )}

        {/* Reinitialize theme-ui around code surfer so that all the built in themes work
      // @ts-ignore */}
        <ThemeProvider>
          <AnimatedCodeSurfer
            key={codeSurferKey}
            progress={props.progress}
            steps={steps}
            theme={CODE_THEMES_DICT[theme].theme}
          />
        </ThemeProvider>
      </Box>
    )
  },
)
