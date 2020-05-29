import { produce } from 'immer'
import React, { Dispatch, FC, createContext } from 'react'
import { RGBColor } from 'react-color'
import { useImmerReducer } from 'use-immer'

import {
  DEFAULT_CYCLE,
  DEFAULT_CYCLE_SPEED,
  DEFAULT_IMMEDIATE,
  DEFAULT_PREVIEW_THEME,
} from '../const'
import { UnreachableCaseError, noop, omit } from '../utils'

export type BackgroundColor = RGBColor

// Pulled from source cause types aren't exported right
export type InputStep = {
  code: string
  focus?: string
  title?: string
  subtitle?: string
  showNumbers?: boolean
  lang: string
  id: string
}

type SnippetState = {
  immediate: boolean
  theme: string
  defaultLanguage: string
  backgroundColor: BackgroundColor
  title: string
  startingStep: number
  cycle: boolean
  steps: InputStep[]
  cycleSpeed: number
}

type SnippetAction =
  | ({
      type: 'updateSnippetState'
    } & Partial<SnippetState>)
  | {
      type: 'resetSnippetState'
    }
  | {
      type: 'updateLanguage'
      lang: string
    }
  | ({
      type: 'updateStep'
      stepID: string
    } & Partial<InputStep>)

const initialSnippetState: SnippetState = {
  immediate: DEFAULT_IMMEDIATE,
  theme: DEFAULT_PREVIEW_THEME,
  defaultLanguage: 'typescript',
  backgroundColor: {
    r: 51,
    g: 197,
    b: 173,
    a: 100,
  },
  title: '',
  startingStep: 0,
  cycleSpeed: DEFAULT_CYCLE_SPEED,
  cycle: DEFAULT_CYCLE,
  steps: [
    {
      code: `var x1: any = 1\ndebugger`,
      // focus: '1[1:14]',
      lang: 'typescript',
      id: 'dfgs',
    },
    {
      code: `var x0: any = 3
var x1 = 1
var x0 = 3`,
      focus: '',
      lang: 'typescript',
      id: 'gfdsg',
    },
    {
      code: `var x0: number = 3
var x1 = 1
var x1 = 1
var x0 = 3`,
      lang: 'typescript',
      id: '1werw',
    },
  ],
}

const SnippetStateContext = createContext<SnippetState>(initialSnippetState)
const SnippetDispatchContext = createContext<Dispatch<SnippetAction>>(noop)

const snippetReducer = produce((state: SnippetState, action: SnippetAction) => {
  switch (action.type) {
    case 'updateSnippetState':
      return { ...state, ...omit(['type'], action) }
    case 'updateLanguage':
      return {
        ...state,
        defaultLanguage: action.lang,
        steps: state.steps.map((s) => {
          return { ...s, lang: action.lang }
        }),
      }
    case 'updateStep':
      // eslint-disable-next-line no-case-declarations
      const stepToUpdate = state.steps.findIndex((s) => {
        return s.id === action.stepID
      })

      if (stepToUpdate === -1) {
        console.warn('Step ID does not exist!')
        return
      }

      state.steps[stepToUpdate] = {
        ...state.steps[stepToUpdate],
        ...omit(['type', 'stepIndex'], action),
      }
      return
    case 'resetSnippetState':
      return { ...initialSnippetState }

    default:
      // eslint-disable-next-line no-case-declarations
      const { type } = action
      throw new UnreachableCaseError(type)
  }
})

export const SnippetProvider: FC = ({ children }) => {
  const [state, dispatch] = useImmerReducer(snippetReducer, initialSnippetState)

  return (
    <SnippetStateContext.Provider value={state}>
      <SnippetDispatchContext.Provider value={dispatch}>
        {children}
      </SnippetDispatchContext.Provider>
    </SnippetStateContext.Provider>
  )
}

export const useSnippetState = () => {
  const context = React.useContext(SnippetStateContext)
  if (context === undefined) {
    throw new Error('useSnippetState must be used within a SnippetProvider')
  }
  return context
}
export const useSnippetDispatch = () => {
  const context = React.useContext(SnippetDispatchContext)
  if (context === undefined) {
    throw new Error('useSnippetDispatch must be used within a SnippetProvider')
  }
  return context
}
