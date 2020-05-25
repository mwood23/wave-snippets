import React, { Dispatch, FC, createContext, useReducer } from 'react'
import { RGBColor } from 'react-color'

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
  // Making the assumption that all steps are the same language for now
  // lang?: string
  showNumbers?: boolean
}

type SnippetState = {
  immediate: boolean
  theme: string
  language: string
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

const initialSnippetState: SnippetState = {
  immediate: DEFAULT_IMMEDIATE,
  theme: DEFAULT_PREVIEW_THEME,
  language: 'typescript',
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
      focus: '2',
    },
    {
      code: `
var x0: any = 3
var x1 = 1
var x0 = 3`,
    },
    {
      code: `
var x0: number = 3
var x1 = 1
var x1 = 1
var x0 = 3`,
    },
  ],
}

const SnippetStateContext = createContext<SnippetState>(initialSnippetState)
const SnippetDispatchContext = createContext<Dispatch<SnippetAction>>(noop)

const snippetReducer = (state: SnippetState, action: SnippetAction) => {
  switch (action.type) {
    case 'updateSnippetState':
      return { ...state, ...omit(['type'], action) }
    case 'resetSnippetState':
      return { ...initialSnippetState }

    default:
      // eslint-disable-next-line no-case-declarations
      const { type } = action
      throw new UnreachableCaseError(type)
  }
}

export const SnippetProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(snippetReducer, initialSnippetState)

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
