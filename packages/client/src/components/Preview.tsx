import { CodeSurfer } from '@code-surfer/standalone'
import styled from '@emotion/styled'
import { InputStep } from '@waves/shared'
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
import { usePreviewDispatch, usePreviewState } from '../context'
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
  onAnimationCycleEnd?: () => void
  /**
   * EXPERIMENTAL
   *
   * Disables the fixed height and width and fills the containing element.
   */
  responsive?: boolean
}

const PreviewContainer = styled(Box)`
  /* .cs-content {
    display: flex;
    align-items: center;
  } */

  /* .cs-scaled-content {
    transform-origin: center !important;
  } */
`

export const Preview = forwardRef<any, PreviewProps>(
  (
    {
      steps,
      springPreset = DEFAULT_ANIMATION_PRESET,
      theme = DEFAULT_PREVIEW_THEME,
      showLineNumbers = DEFAULT_SHOW_NUMBERS,
      cycleSpeed = DEFAULT_CYCLE_SPEED,
      playOnInit = false,
      immediate,
      cycle,
      onAnimationCycleEnd = noop,
      responsive = false,
    },
    ref,
  ) => {
    const totalSteps = steps.length - 1
    const dispatch = usePreviewDispatch()
    const { currentStep, isPlaying, pauseAnimation } = usePreviewState()
    const [codeSurferKey, setCodeSurferKey] = useState(1)
    const [loading, setLoading] = useState(false)

    const [debouncedCallback] = useDebouncedCallback(() => {
      setLoading(false)
      setCodeSurferKey((key) => key + 1)
    }, 1500)

    useEffect(() => {
      setLoading(true)
      debouncedCallback()
      // Show line numbers is global to a snippet right now and why it's passed in
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [steps, showLineNumbers])

    useEffect(() => {
      if (isPlaying) {
        dispatch({
          type: 'updatePreviewState',
          currentStep: totalSteps > 1 ? currentStep + 1 : currentStep,
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying])

    useEffect(() => {
      if (playOnInit) {
        dispatch({
          type: 'updatePreviewState',
          isPlaying: true,
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playOnInit])

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
      pause: pauseAnimation,
    })

    return (
      <PreviewContainer
        className="code-snippet-preview-container"
        height={'314px'}
        margin="0 auto"
        overflow={'hidden'}
        position="relative"
        ref={ref}
        width={responsive ? '100%' : '550px'}
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
            steps={steps.map((s) => ({
              ...s,
              showNumbers: showLineNumbers,
            }))}
            theme={CODE_THEMES_DICT[theme].theme}
          />
        </ThemeProvider>
      </PreviewContainer>
    )
  },
)
