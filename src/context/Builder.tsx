import React, { Dispatch, FC, createContext, useReducer } from 'react'

import { DEFAULT_PREVIEW_THEME } from '../const'
import { UnreachableCaseError, noop, omit } from '../utils'

type BuilderState = {
  currentStep: number
  teleport: boolean
  pause: boolean
  theme: string
  language: string
  backgroundColor: string
  title: string
}

type BuilderAction =
  | {
      type: 'setStep'
      step: number
    }
  | ({
      type: 'updateBuilderState'
    } & Partial<BuilderState>)
  | {
      type: 'resetBuilderState'
    }

const initialBuilderState: BuilderState = {
  currentStep: 0,
  teleport: false,
  pause: false,
  theme: DEFAULT_PREVIEW_THEME,
  language: 'typescript',
  backgroundColor: '#50e3c2',
  title: '',
}

const BuilderStateContext = createContext<BuilderState>(initialBuilderState)
const BuilderDispatchContext = createContext<Dispatch<BuilderAction>>(noop)

const builderReducer = (state: BuilderState, action: BuilderAction) => {
  switch (action.type) {
    case 'setStep':
      return { ...state, currentStep: action.step }
    case 'updateBuilderState':
      return { ...state, ...omit(['type'], action) }
    case 'resetBuilderState':
      return { ...initialBuilderState }

    default:
      // eslint-disable-next-line no-case-declarations
      const { type } = action
      throw new UnreachableCaseError(type)
  }
}

export const BuilderProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(builderReducer, initialBuilderState)

  return (
    <BuilderStateContext.Provider value={state}>
      <BuilderDispatchContext.Provider value={dispatch}>
        {children}
      </BuilderDispatchContext.Provider>
    </BuilderStateContext.Provider>
  )
}

export const useBuilderState = () => {
  const context = React.useContext(BuilderStateContext)
  if (context === undefined) {
    throw new Error('useBuilderState must be used within a BuilderProvider')
  }
  return context
}
export const useBuilderDispatch = () => {
  const context = React.useContext(BuilderDispatchContext)
  if (context === undefined) {
    throw new Error('useBuilderDispatch must be used within a BuilderProvider')
  }
  return context
}
