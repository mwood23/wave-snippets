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
import { TITLE_BAR_HEIGHT } from './WindowTitleBar'

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
      responsive = true,
    },
    ref,
  ) => {
    const dispatch = usePreviewDispatch()
    const { currentStep, isPlaying, pauseAnimation } = usePreviewState()
    const [codeSurferState, setCodeSurferState] = useState<{
      key: number
      steps: InputStep[]
    }>({
      key: 1,
      steps,
    })
    const [loading, setLoading] = useState(false)

    const remountPreview = () => {
      setLoading(false)
      setCodeSurferState((previousState) => ({
        key: previousState.key + 1,
        steps,
      }))
    }
    const totalSteps = codeSurferState.steps.length - 1
    const chosenTheme = CODE_THEMES_DICT[theme]
    const [debouncedCallback] = useDebouncedCallback(remountPreview, 1500)

    useEffect(() => {
      setLoading(true)
      debouncedCallback()
      // Show line numbers is global to a snippet right now and why it's passed in
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [steps, showLineNumbers])

    // How many more can we go?!
    const determineStepToGoTo = () =>
      totalSteps >= 1
        ? currentStep === totalSteps
          ? cycle || (!playOnInit && isPlaying)
            ? 0
            : currentStep
          : currentStep + 1
        : currentStep

    useEffect(() => {
      if (isPlaying) {
        dispatch({
          type: 'updatePreviewState',
          currentStep: determineStepToGoTo(),
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
            currentStep: determineStepToGoTo(),
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
        height={`calc(100% - ${TITLE_BAR_HEIGHT})`}
        margin="0 auto"
        overflow={'hidden'}
        position="relative"
        ref={ref}
        width={responsive ? '100%' : '550px'}
      >
        {codeSurferState.key !== 1 && loading && (
          <Spinner
            color={chosenTheme.themeType === 'light' ? 'gray.600' : 'white'}
            position="absolute"
            right="6"
            top="0"
            zIndex={5000}
          />
        )}

        {/* Reinitialize theme-ui around code surfer so that all the built in themes work
      // @ts-ignore */}
        <ThemeProvider>
          <AnimatedCodeSurfer
            // Pretty horrible hack here. Something internal to this holds on to old state
            // so if something gets messed up with focus then not even deleting will fix it.
            // Here we a compute the key on number of steps so that delete guarantees a remount
            // to not hold onto back step data.
            key={codeSurferState.key}
            progress={props.progress}
            steps={codeSurferState.steps.map((s) => ({
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
