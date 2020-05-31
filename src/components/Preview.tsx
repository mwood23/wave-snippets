import { CodeSurfer } from '@code-surfer/standalone'
import React, { forwardRef, useEffect, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import { ThemeProvider } from 'theme-ui'
import { useDebouncedCallback } from 'use-debounce'

import { CODE_THEMES_DICT } from '../code-themes'
import {
  ANIMATION_PRESETS_DICT,
  DEFAULT_ANIMATION_PRESET,
  DEFAULT_CYCLE_SPEED,
  DEFAULT_PREVIEW_THEME,
  DEFAULT_SHOW_NUMBERS,
} from '../const'
import { InputStep, usePreviewDispatch, usePreviewState } from '../context'
import { noop } from '../utils'
import { Box, Spinner } from './core'

const AnimatedCodeSurfer = animated(CodeSurfer)

export type PreviewProps = {
  steps: InputStep[]
  springPreset?: string
  theme?: string
  playOnInit?: boolean
  cycle?: boolean
  cycleSpeed?: number
  immediate?: boolean
  showLineNumbers?: boolean

  onAnimationCycleEnd: () => void
}

// TODO: Hook up all the props
export const Preview = forwardRef<any, PreviewProps>(
  (
    {
      steps,
      springPreset = DEFAULT_ANIMATION_PRESET,
      theme = DEFAULT_PREVIEW_THEME,
      showLineNumbers = DEFAULT_SHOW_NUMBERS,
      cycleSpeed = DEFAULT_CYCLE_SPEED,
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

    console.log(steps, isPlaying)

    const [debouncedCallback] = useDebouncedCallback(() => {
      setLoading(false)
      setCodeSurferKey((key) => {
        return key + 1
      })
    }, 1500)

    useEffect(() => {
      setLoading(true)
      debouncedCallback()
    }, [steps, showLineNumbers])

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
      config: ANIMATION_PRESETS_DICT[springPreset].config,
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
            steps={steps.map((s) => {
              return {
                ...s,
                showNumbers: showLineNumbers,
              }
            })}
            theme={CODE_THEMES_DICT[theme].theme}
          />
        </ThemeProvider>
      </Box>
    )
  },
)
