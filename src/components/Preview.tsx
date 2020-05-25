import { CodeSurfer } from '@code-surfer/standalone'
import React, { forwardRef, useEffect } from 'react'
import {
  config as ReactSpringPresets,
  SpringConfig,
  animated,
  useSpring,
} from 'react-spring'
import { ThemeProvider } from 'theme-ui'

import { CODE_THEMES_DICT } from '../code-themes'
import { DEFAULT_PREVIEW_THEME } from '../const'
import { InputStep, usePreviewDispatch, usePreviewState } from '../context'
import { noop } from '../utils'
import { Box } from './core'

const AnimatedCodeSurfer = animated(CodeSurfer)

export type PreviewProps = {
  steps: InputStep[]

  springConfig?: SpringConfig

  //   TODO: Create more fun presets
  springPreset?: keyof typeof ReactSpringPresets

  theme?: string
  language: string

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
      language,
      playOnInit = true,
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

    useEffect(() => {
      if (playOnInit) {
        dispatch({
          type: 'updatePreviewState',
          currentStep: totalSteps > 1 ? currentStep + 1 : currentStep,
          isPlaying: true,
        })
      }
    }, [])

    const props = useSpring({
      progress: currentStep,
      config: ReactSpringPresets[springPreset],
      delay: cycleSpeed,
      onRest: () => {
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

        if (currentStep === totalSteps) {
          onAnimationCycleEnd()
        }
      },
      pause: !isPlaying,
      immediate,
    })

    return (
      <Box height={'314px'} overflow={'hidden'} ref={ref} width={'550px'}>
        {/* Reinitialize theme-ui around code surfer so that all the built in themes work
      // @ts-ignore */}
        <ThemeProvider>
          <AnimatedCodeSurfer
            progress={props.progress}
            steps={steps.map((s) => {
              return {
                ...s,
                lang: language,
              }
            })}
            theme={CODE_THEMES_DICT[theme].theme}
          />
        </ThemeProvider>
      </Box>
    )
  },
)
