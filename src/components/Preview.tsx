import { CodeSurfer } from '@code-surfer/standalone'
import React, { forwardRef } from 'react'
import {
  config as ReactSpringPresets,
  SpringConfig,
  animated,
  useSpring,
} from 'react-spring'
import { ThemeProvider } from 'theme-ui'

import { CODE_THEMES_DICT } from '../code-themes'
import { DEFAULT_CYCLE_SPEED, DEFAULT_PREVIEW_THEME } from '../const'
import { useCycle } from '../hooks'
import { noop } from '../utils'
import { Box } from './core'

const AnimatedCodeSurfer = animated(CodeSurfer)

// Pulled from source cause types aren't exported right
interface InputStep {
  code: string
  focus?: string
  title?: string
  subtitle?: string
  // Making the assumption that all steps are the same language for now
  // lang?: string
  showNumbers?: boolean
}

export type PreviewProps = {
  steps: InputStep[]
  /**
   * Speed to cycle the steps in milleseconds
   */
  speed?: number

  /**
   * Pass true to cycle through the steps
   */
  cycle?: boolean

  /**
   * Time in milliseconds for the springs to be activated between steps. A lower number is a quicker animation.
   */
  cycleSpeed?: number

  /**
   * Skip the spring animation.
   */
  teleport?: boolean

  /**
   * Stop cycling through the steps
   */
  pause?: boolean

  springConfig?: SpringConfig

  //   TODO: Create more fun presets
  springPreset?: keyof typeof ReactSpringPresets

  initialStep?: number

  theme?: string
  language: string

  onStepChange?: (newStep: number) => void

  onAnimationCycleStart?: () => void
  onAnimationCycleEnd?: () => void
}

// TODO: Hook up all the props
export const Preview = forwardRef<any, PreviewProps>(
  (
    {
      steps,
      cycleSpeed = DEFAULT_CYCLE_SPEED,
      pause = false,
      springPreset = 'molasses',
      initialStep = 0,
      onAnimationCycleEnd = noop,
      onStepChange = noop,
      theme = DEFAULT_PREVIEW_THEME,
      language,
    },
    ref,
  ) => {
    const totalSteps = steps.length - 1
    const [currentStep] = useCycle({
      totalSteps,
      cycleSpeed,
      initialStep,
      pause,
    })

    const props = useSpring({
      progress: currentStep,
      config: ReactSpringPresets[springPreset],
      onRest: () => {
        console.log(totalSteps, currentStep)
        if (totalSteps === currentStep) {
          onAnimationCycleEnd()
        }
      },
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
