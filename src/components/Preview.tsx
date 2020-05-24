import { Box } from '@chakra-ui/core'
import { CodeSurfer } from '@code-surfer/standalone'
import { nightOwl } from '@code-surfer/themes'
import React, { forwardRef } from 'react'
import {
  config as ReactSpringPresets,
  SpringConfig,
  animated,
  useSpring,
} from 'react-spring'
import { ThemeProvider } from 'theme-ui'

import { DEFAULT_CYCLE_SPEED } from '../const'
import { useCycle } from '../hooks'
import { noop } from '../utils'

const AnimatedCodeSurfer = animated(CodeSurfer)

// Pulled from source cause types aren't exported right
interface InputStep {
  code: string
  focus?: string
  title?: string
  subtitle?: string
  lang?: string
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
      <Box height={'300px'} overflow={'hidden'} ref={ref} width={'300px'}>
        {/* Reinitialize theme-ui around code surfer so that all the built in themes work
      // @ts-ignore */}
        <ThemeProvider>
          <AnimatedCodeSurfer
            progress={props.progress}
            steps={steps}
            theme={nightOwl}
          />
        </ThemeProvider>
      </Box>
    )
  },
)
